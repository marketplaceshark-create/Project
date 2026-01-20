import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngFor/@for
import { AdminData } from '../../services/admin-data';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private dataService = inject(AdminData);

  // State
  activeTab = signal('product'); // Default tab
  tableData = signal<any[]>([]); // The data currently shown
  loading = signal(false);

  // Schema to know which endpoint to hit
  tabs = [
    { id: 'category', label: 'Categories', icon: '📁' },
    { id: 'product', label: 'Products', icon: '📦' },
    { id: 'customer', label: 'Customers', icon: '👥' },
    { id: 'plan', label: 'Plans', icon: 'wm' }
  ];

  ngOnInit() {
    this.loadData('product'); // Load products by default
  }

  switchTab(tabId: string) {
    this.activeTab.set(tabId);
    this.loadData(tabId);
  }

  loadData(endpoint: string) {
    this.loading.set(true);
    // Django endpoints usually have trailing slash, e.g., 'product/'
    this.dataService.getAll(endpoint + '/').subscribe({
      next: (data) => {
        this.tableData.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.loading.set(false);
      }
    });
  }

  deleteRow(id: number) {
    if(!confirm('Are you sure?')) return;
    
    this.dataService.deleteItem(this.activeTab() + '/', id).subscribe(() => {
      // Refresh data after delete
      this.loadData(this.activeTab());
    });
  }
}