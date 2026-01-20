import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AdminData } from '../../services/admin-data';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private dataService = inject(AdminData);

  // --- STATE ---
  activeTab = signal('product'); 
  tableData = signal<any[]>([]); 
  loading = signal(false);
  
  // Modal State
  isModalOpen = signal(false);
  isEditMode = signal(false);
  currentItem = signal<any>({}); 

  // --- SCHEMAS ---
  schemas: any = {
    category: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' }
    ],
    product: [
      { key: 'productName', label: 'Product Name', type: 'text' },
      { key: 'productDescription', label: 'Description', type: 'text' },
      { key: 'category', label: 'Category ID', type: 'number' },
      { key: 'productImage', label: 'Image URL', type: 'text' }
    ],
    customer: [
      { key: 'name', label: 'Full Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' }
    ],
    plan: [
      { key: 'name', label: 'Plan Name', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'duration', label: 'Duration', type: 'text' }
    ]
  };

  tabs = [
    { id: 'category', label: 'Categories', icon: '📁' },
    { id: 'product', label: 'Products', icon: '📦' },
    { id: 'customer', label: 'Customers', icon: '👥' },
    { id: 'plan', label: 'Plans', icon: '💎' }
  ];

  currentSchema = computed(() => this.schemas[this.activeTab()] || []);

  ngOnInit() {
    this.loadData('product');
  }

  switchTab(tabId: string) {
    this.activeTab.set(tabId);
    this.loadData(tabId);
  }

  loadData(endpoint: string) {
    this.loading.set(true);
    this.dataService.getAll(endpoint + '/').subscribe({
      next: (data) => {
        this.tableData.set(data);
        this.loading.set(false);
      },
      error: (e) => this.loading.set(false)
    });
  }

  // --- ADD / EDIT LOGIC ---

  openAdd() {
    this.isEditMode.set(false);
    this.currentItem.set({});
    this.isModalOpen.set(true);
  }

  openEdit(item: any) {
    this.isEditMode.set(true);
    this.currentItem.set({ ...item });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  // FIXED: Helper method to update the signal from the template
  updateField(key: string, value: any) {
    this.currentItem.update(prev => ({ ...prev, [key]: value }));
  }

  saveItem() {
    const endpoint = this.activeTab() + '/';
    const data = this.currentItem();

    if (this.isEditMode()) {
      this.dataService.updateItem(endpoint, data.id, data).subscribe(() => {
        this.loadData(this.activeTab());
        this.closeModal();
      });
    } else {
      this.dataService.createItem(endpoint, data).subscribe(() => {
        this.loadData(this.activeTab());
        this.closeModal();
      });
    }
  }

  deleteRow(id: number) {
    if(!confirm('Delete this record?')) return;
    this.dataService.deleteItem(this.activeTab() + '/', id).subscribe(() => {
      this.loadData(this.activeTab());
    });
  }
}