import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

export interface ServerConfig {
  // Basic Settings
  hostname: string;
  maxPlayers: number;
  password: string;
  passwordAdmin: string;
  serverTime: string;
  serverTimeAcceleration: number;
  serverNightTimeAcceleration: number;
  serverTimePersistent: boolean;
  guaranteedUpdates: number;
  loginQueueConcurrentPlayers: number;
  loginQueueMaxPlayers: number;
  instanceId: number;
  storageAutoFix: boolean;

  // Security
  verifySignatures: number;
  forceSameBuild: boolean;
  disableVoN: boolean;
  vonCodecQuality: number;
  disable3rdPerson: boolean;
  disableCrosshair: boolean;
  disablePersonalLight: boolean;
  lightingConfig: boolean;
  class: string;
  template: string;

  // Performance
  cpuCount: number;
  memoryAllocator: string;
  enableHyperThreading: boolean;
  scriptDebug: boolean;
  adminLog: boolean;
  netLog: boolean;
  freezeDetection: boolean;
  limitFPS: number;
  
  // Gameplay
  timeStampFormat: string;
  motd: string[];
  motdInterval: number;
  maxPing: number;
  maxDesync: number;
  maxPacketLoss: number;
  enableWhitelist: boolean;
  
  // Mods
  mods: string[];
  serverMods: string[];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  loading = true;
  saving = false;
  activeTab = 'basic';
  
  // Configuration options
  memoryAllocators = ['system', 'tbb4malloc_bi', 'tcmalloc_minimal', 'jemalloc'];
  timeStampFormats = ['none', 'short', 'full'];
  verifySignatureOptions = [
    { value: 0, label: 'Disabled' },
    { value: 1, label: 'Enabled (no verification on join)' },
    { value: 2, label: 'Enabled (with verification on join)' }
  ];
  vonCodecQualityOptions = [
    { value: 0, label: 'Low (8 kHz)' },
    { value: 1, label: 'Standard (16 kHz)' },
    { value: 10, label: 'High (32 kHz)' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.settingsForm = this.createSettingsForm();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  createSettingsForm(): FormGroup {
    return this.fb.group({
      // Basic Settings
      hostname: ['My DayZ Server', Validators.required],
      maxPlayers: [60, [Validators.required, Validators.min(1), Validators.max(100)]],
      password: [''],
      passwordAdmin: ['', Validators.required],
      serverTime: ['SystemTime'],
      serverTimeAcceleration: [1, [Validators.min(0.1), Validators.max(24)]],
      serverNightTimeAcceleration: [1, [Validators.min(0.1), Validators.max(24)]],
      serverTimePersistent: [false],
      guaranteedUpdates: [1, [Validators.min(1), Validators.max(10)]],
      loginQueueConcurrentPlayers: [5, [Validators.min(1), Validators.max(20)]],
      loginQueueMaxPlayers: [500, [Validators.min(10), Validators.max(1000)]],
      instanceId: [1, [Validators.min(1), Validators.max(100)]],
      storageAutoFix: [true],

      // Security Settings  
      verifySignatures: [2],
      forceSameBuild: [true],
      disableVoN: [false],
      vonCodecQuality: [1],
      disable3rdPerson: [false],
      disableCrosshair: [false],
      disablePersonalLight: [false],
      lightingConfig: [true],
      class: ['DayZ'],
      template: [''],

      // Performance Settings
      cpuCount: [4, [Validators.min(1), Validators.max(32)]],
      memoryAllocator: ['system'],
      enableHyperThreading: [true],
      scriptDebug: [false],
      adminLog: [true],
      netLog: [false],
      freezeDetection: [false],
      limitFPS: [200, [Validators.min(30), Validators.max(300)]],

      // Gameplay Settings
      timeStampFormat: ['short'],
      motdInterval: [30, [Validators.min(1), Validators.max(300)]],
      maxPing: [200, [Validators.min(50), Validators.max(1000)]],
      maxDesync: [150, [Validators.min(50), Validators.max(500)]],
      maxPacketLoss: [50, [Validators.min(10), Validators.max(100)]],
      enableWhitelist: [false],

      // Arrays for dynamic content
      motd: this.fb.array(['Welcome to our DayZ Server!']),
      mods: this.fb.array([]),
      serverMods: this.fb.array([])
    });
  }

  get motdArray(): FormArray {
    return this.settingsForm.get('motd') as FormArray;
  }

  get modsArray(): FormArray {
    return this.settingsForm.get('mods') as FormArray;
  }

  get serverModsArray(): FormArray {
    return this.settingsForm.get('serverMods') as FormArray;
  }

  loadSettings(): void {
    this.loading = true;
    
    if (environment.mockMode) {
      // Mock data for development
      setTimeout(() => {
        this.settingsForm.patchValue({
          hostname: 'DayZ Server [MOCK]',
          maxPlayers: 60,
          password: '',
          passwordAdmin: 'admin123',
          serverTimeAcceleration: 2,
          serverNightTimeAcceleration: 8,
          serverTimePersistent: true,
          verifySignatures: 2,
          forceSameBuild: true,
          cpuCount: 8,
          memoryAllocator: 'tbb4malloc_bi',
          enableHyperThreading: true,
          timeStampFormat: 'full',
          maxPing: 150,
          enableWhitelist: false
        });
        
        // Add some mock mods
        this.addMod('1565871491'); // CF MOD
        this.addMod('1559212036'); // Community-Online-Tools
        
        this.loading = false;
      }, 1000);
    } else {
      // Real API call would go here
      this.apiService.getServerInfo().subscribe({
        next: (config) => {
          // Map API response to form
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading settings:', error);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.saving = true;
      const settings = this.settingsForm.value;
      
      if (environment.mockMode) {
        // Mock save
        setTimeout(() => {
          console.log('Settings saved (mock):', settings);
          this.saving = false;
          this.showSuccessMessage();
        }, 1500);
      } else {
        // Real API call would go here
        setTimeout(() => {
          this.saving = false;
          this.showSuccessMessage();
        }, 1500);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.settingsForm.reset();
      this.loadSettings();
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // MOTD Management
  addMotdLine(): void {
    this.motdArray.push(this.fb.control(''));
  }

  removeMotdLine(index: number): void {
    this.motdArray.removeAt(index);
  }

  // Mods Management
  addMod(modId: string = ''): void {
    this.modsArray.push(this.fb.control(modId, [Validators.pattern(/^\d{10}$|^@[\w-]+$/)]));
  }

  removeMod(index: number): void {
    this.modsArray.removeAt(index);
  }

  addServerMod(modId: string = ''): void {
    this.serverModsArray.push(this.fb.control(modId, [Validators.pattern(/^\d{10}$|^@[\w-]+$/)]));
  }

  removeServerMod(index: number): void {
    this.serverModsArray.removeAt(index);
  }

  // Utility methods
  private markFormGroupTouched(): void {
    Object.keys(this.settingsForm.controls).forEach(key => {
      const control = this.settingsForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessMessage(): void {
    // You could integrate with a toast service here
    alert('Settings saved successfully!');
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.settingsForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.settingsForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
      if (field.errors['max']) return `Maximum value is ${field.errors['max'].max}`;
      if (field.errors['pattern']) return `Invalid format`;
    }
    return '';
  }
} 