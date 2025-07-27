import { Component, OnInit } from '@angular/core';
import { ApiService, Player } from '../../services/api.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  loading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.apiService.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading players:', error);
        this.loading = false;
      }
    });
  }

  kickPlayer(player: Player): void {
    if (confirm(`Are you sure you want to kick ${player.name}?`)) {
      this.apiService.kickPlayer(player.id).subscribe({
        next: (response) => {
          console.log('Player kicked:', response);
          this.loadPlayers(); // Reload the player list
        },
        error: (error) => {
          console.error('Error kicking player:', error);
        }
      });
    }
  }
} 