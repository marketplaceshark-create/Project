import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  customers: any[] = [];
  selectedFile: any = null;
  editModeId: number | null = null; // Track which row is being edited

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.authService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }

  // 1. Triggered when file input changes
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // 2. Convert File to Base64 and Upload
  uploadImage(customer: any) {
    if (!this.selectedFile) {
      alert("Please select a file first");
      return;
    }

    const reader = new FileReader();
    
    // When reader finishes reading the file...
    reader.onload = (e: any) => {
      const base64String = e.target.result; // This is the string we send to Django
      
      // Prepare payload (Only updating the image)
      const payload = {
        name: customer.name,       // Django PUT usually requires all fields or PATCH
        email: customer.email,     // Include basic required fields just in case
        phone: customer.phone,
        password: customer.password,
        profile_image: base64String // The Magic String
      };

      this.authService.updateCustomer(customer.id, payload).subscribe({
        next: (res) => {
          alert('Image Uploaded Successfully!');
          this.loadCustomers(); // Refresh list to show new image
          this.editModeId = null; // Exit edit mode
          this.selectedFile = null;
        },
        error: (err) => {
          console.error(err);
          alert('Upload Failed');
        }
      });
    };

    // Start reading
    reader.readAsDataURL(this.selectedFile);
  }
}