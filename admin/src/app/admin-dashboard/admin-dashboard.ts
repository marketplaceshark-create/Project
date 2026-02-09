import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {/*  */
  currentTitle = 'customer';
  columns: string[] = [];
  dataList: any[] = [];

  isSaving = false;
  
  showModal = false;
  editId: number | null = null;
  tempItem: any = {}; 
  newItem: any = {};

  // Admin only sees these fields (Password hidden from UI)
  fieldConfig: any = {
    customer: ['name', 'email', 'phone', 'address'],
    category: ['name', 'description'],
    product: ['productName', 'productDescription', 'category'],
    plan: ['name', 'duration', 'price'],
    user: ['name', 'email', 'phone']
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.setView('customer');
  }

  setView(type: string) {
    this.currentTitle = type;
    this.editId = null;
    
    if (type === 'customer') {
      this.columns = ['name', 'email', 'phone', 'address'];
    } else if (type === 'category') {
      this.columns = ['name', 'description'];
    } else if (type === 'product') {
      this.columns = ['productName', 'productDescription', 'category'];
    } else if (type === 'plan') {
      this.columns = ['name', 'duration', 'price'];
    } else if (type === 'user') {
      this.columns = ['name', 'email', 'phone'];
    }
    this.loadData();
  }

  loadData() {
    this.apiService.getAll(this.currentTitle).subscribe({
      next: (data: any) => this.dataList = data,
      error: (err: any) => console.error('Error fetching data', err)
    });
  }

  openAddModal() {
    this.newItem = {}; 
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveNewItem() {
  // Create a copy so we don't mutate the form UI
  const payload = { ...this.newItem };

  if (this.currentTitle === 'user' || this.currentTitle === 'customer') {
    payload.password = 'AgriAdmin@2026'; 
  }

  // FIX: Force category to be a number if we are in product view
  if (this.currentTitle === 'product' && payload.category) {
    payload.category = Number(payload.category); 
  }

  this.apiService.postData(this.currentTitle, payload).subscribe({
    next: () => {
      alert('Record Added Successfully!');
      this.showModal = false;
      this.loadData();
    },
    error: (err: any) => {
      console.error("DRF Error:", err.error);
      alert('Error: Check console for PK/Type mismatch');
    }
  });
}
  editItem(item: any) {
    this.editId = item.id;
    this.tempItem = { ...item }; 
  }

  cancelEdit() {
    this.editId = null;
    this.tempItem = {};
  }

  saveEdit() {
  if (!this.editId) return;
  
  this.isSaving = true;

  // We pass currentTitle, editId, and the changed data (tempItem)
  this.apiService.update(this.currentTitle, this.editId, this.tempItem).subscribe({
    next: (response: any) => {
      console.log('Update Success:', response);
      
      this.isSaving = false;
      
      // THIS IS THE TRIGGER: Setting this to null hides the input boxes
      this.editId = null; 
      
      this.tempItem = {}; 
      alert('Updated successfully!');
      this.loadData(); // Refresh the table with new data
    },
    error: (err: any) => {
      this.isSaving = false;
      console.error('Update Error:', err);
      alert('Save failed. Check console for details.');
    }
  });
  }
  deleteItem(id: any) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.apiService.delete(this.currentTitle, id).subscribe({
        next: () => {
          alert('Deleted successfully');
          this.loadData();
        },
        error: (err: any) => console.error('Delete error', err)
      });
    }
  }
}