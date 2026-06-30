import { test, expect } from '@playwright/test';

test.describe('MedConnect Comprehensive E2E Testing', () => {

  test('1. Visitor Navigation, Dark Mode Toggle, Contact Form, and Doctors Search/Profile Flow', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/MedConnect/);

    // 2. Test Theme Toggle (Light/Dark mode cycle) - select first matching button to avoid responsive layout duplicates
    const themeBtn = page.locator('button[title^="Theme:"]').first();
    await expect(themeBtn).toBeVisible();
    await themeBtn.click(); // switch light -> dark
    await page.waitForTimeout(500);
    await themeBtn.click(); // switch dark -> system
    await page.waitForTimeout(500);

    // 3. Test Services page loading
    await page.click('nav a:has-text("Services")');
    await page.waitForURL(/.*services/);
    await expect(page.locator('h1')).toContainText('Our Services');

    // 4. Test About page loading
    await page.click('nav a:has-text("About")');
    await page.waitForURL(/.*about/);
    await expect(page.locator('h1')).toContainText('About MedConnect');

    // 5. Test Contact Form Submission
    await page.click('nav a:has-text("Contact")');
    await page.waitForURL(/.*contact/);
    await expect(page.locator('h1')).toContainText('Get in Touch');

    // Fill Contact form
    await page.fill('input[name="name"]', 'User Tester');
    await page.fill('input[name="email"]', 'tester@medconnect.in');
    await page.fill('input[name="phone"]', '+91 99999 88888');
    await page.fill('input[name="subject"]', 'Clinical Platform Feedback');
    await page.fill('textarea[name="message"]', 'MedConnect has a clean, premium and highly intuitive layout. Great job!');
    await page.click('button:has-text("Send Message")');

    // Check for contact success toast
    await expect(page.locator('text=Message Sent!')).toBeVisible();

    // 6. Test Doctor Directory Search and Profile modal interaction
    await page.click('nav a:has-text("Doctors")');
    await page.waitForURL(/.*doctors/);
    await expect(page.locator('h1')).toContainText('Find Your Doctor');

    // Search for doctor
    await page.getByPlaceholder('Search by doctor name or specialty...').fill('Anita');
    await page.click('button:has-text("Dermatologist")');
    
    // Check that Dr. Anita Desai is listed
    await expect(page.locator('text=Dr. Anita Desai')).toBeVisible();

    // Open Doctor Profile modal
    await page.click('button:has-text("View Profile")');
    await expect(page.locator('h2')).toContainText('Dr. Anita Desai');
    await expect(page.locator('text=Education & Credentials')).toBeVisible();

    // Close modal
    await page.click('button:has-text("Close")');
    await expect(page.locator('h2')).not.toBeVisible();
  });

  test('2. Patient Flow: Login, Health Metrics Dashboard, Medical Records, Uploads, and Booking', async ({ page }) => {
    // 1. Patient Login
    await page.goto('/login');
    await page.fill('input#email', 'patient@test.com');
    await page.fill('input#password', 'password123');
    await page.click('button[type="submit"]');

    // 2. Validate Patient Dashboard Welcomes patient
    await page.waitForURL(/.*patient-dashboard/);
    await expect(page.locator('h1')).toContainText('Patient Dashboard');
    await expect(page.locator('text=Welcome back, Rahul Verma')).toBeVisible();

    // 3. Verify Vitals / Health Summary Card display
    await expect(page.locator('text=Health Score')).toBeVisible();
    await expect(page.locator('text=Blood Pressure')).toBeVisible();
    await expect(page.locator('text=Heart Rate')).toBeVisible();

    // 4. View Medical Record Details
    await page.locator('div.flex.items-center.justify-between').filter({ hasText: 'Blood Test' }).locator('button', { hasText: 'View' }).first().click();
    await expect(page.getByRole('heading', { name: 'Report Preview: Blood Test' })).toBeVisible();
    await expect(page.locator('text=Clinical Results')).toBeVisible();
    await expect(page.locator('text=Haemoglobin: 14.2 g/dL')).toBeVisible();

    // Test Interactive Zoom Controls
    await page.click('button[title="Zoom In"]');
    await expect(page.locator('text=110%')).toBeVisible();
    await page.click('button[title="Reset Zoom"]');
    await expect(page.locator('text=100%')).toBeVisible();

    // Download PDF (Simulate click)
    await page.click('button:has-text("Download PDF")');
    await expect(page.locator('text=Downloaded: blood_test_report.pdf')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');

    // 5. Test File Upload functionality
    // Set file input files directly on the input element to avoid system filechooser dialog blocks
    await page.setInputFiles('input#record-upload-input', {
      name: 'prescription_january.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('mock pdf content')
    });
    // Check toast
    await expect(page.locator('text=Uploaded successfully')).toBeVisible();

    // 6. Navigate to doctors page from dashboard to book appointment
    await page.click('a:has-text("Find Doctors")');
    await page.waitForURL(/.*doctors/);

    // Search and select Dr. Priya Sharma
    await page.click('button:has-text("Cardiologist")');
    await expect(page.locator('text=Dr. Priya Sharma')).toBeVisible();
    await page.click('a[href*="doctorId="] >> button:has-text("Book")');

    // Verify redirect to Booking page with prepopulated doctor
    await page.waitForURL(/.*appointments\/book/);
    await expect(page.locator('h1')).toContainText('Book an Appointment');
    await expect(page.locator('select#doctor')).toBeDisabled(); // disabled due to prepopulated doctor

    // Input date time: July 3rd, 2026 at 2:00 PM
    await page.fill('input#dateTime', '2026-07-03T14:00');
    await page.fill('textarea#notes', 'Follow up on blood pressure readings');
    await page.click('button[type="submit"]');

    // Redirect to patient dashboard and assert appointment is scheduled
    await page.waitForURL(/.*patient-dashboard/);
    await expect(page.locator('text=Appointment booked successfully!')).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL(/.*login/);
  });

  test('3. Doctor Flow: Schedule updates, Patient Records check, File upload & Status edits', async ({ page }) => {
    // 1. Doctor Login
    await page.goto('/login');
    await page.fill('input#email', 'doctor@test.com');
    await page.fill('input#password', 'password123');
    await page.click('button[type="submit"]');

    // 2. Validate Dashboard & Welcome message
    await page.waitForURL(/.*doctor-dashboard/);
    await expect(page.locator('h1')).toContainText('Doctor Dashboard');
    await expect(page.locator('text=Dr. Priya Sharma')).toBeVisible();

    // 3. View Patient Medical History records & Preview Report
    await page.locator('div.flex.items-center.justify-between').filter({ hasText: 'Sanjay Verma' }).locator('button', { hasText: 'View Records' }).first().click();
    await expect(page.getByRole('heading', { name: 'Medical Records' })).toBeVisible();
    
    // Click Preview Report inside the records list
    await page.click('button:has-text("Preview Report") >> nth=0');
    await expect(page.getByRole('heading', { name: 'Report Preview: Blood Pressure Check' })).toBeVisible();
    // Use container selector to avoid strict mode violations on duplicate elements in parent card
    await expect(page.locator('#medical-report-printable-area').getByText('135/85 mmHg')).toBeVisible();
    
    // Close preview modal
    await page.keyboard.press('Escape');
    // Close records list modal
    await page.keyboard.press('Escape');

    // 4. Test Prescription upload simulation
    // Set files directly on input to avoid system filechooser dialog blocks
    await page.setInputFiles('input#presc-upload-input', {
      name: 'diagnostics_report.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('mock content')
    });
    await expect(page.locator('text=Uploaded successfully')).toBeVisible();

    // 5. Test Availability toggle
    await page.click('button:has-text("Manage Schedule")');
    await expect(page.locator('text=Availability schedule synchronized')).toBeVisible();

    // 6. Confirm or Complete an appointment
    // Find the pending or confirmed appointment card and edit status
    const confirmBtn = page.locator('button:has-text("Confirm")').first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await expect(page.locator('text=status updated to Confirmed')).toBeVisible();
    } else {
      const completeBtn = page.locator('button:has-text("Complete")').first();
      if (await completeBtn.isVisible()) {
        await completeBtn.click();
        await expect(page.locator('text=status updated to Completed')).toBeVisible();
      }
    }

    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL(/.*login/);
  });

  test('4. Admin Flow: Interactive Dashboard, Tab toggles, and System Stats Verification', async ({ page }) => {
    // 1. Admin Login
    await page.goto('/admin-auth');
    await page.fill('input#email', 'admin@medconnect.in');
    await page.fill('input#password', 'admin123');
    await page.click('button[type="submit"]');

    // 2. Dashboard loaded check
    await page.waitForURL(/.*admin-dashboard/);
    await expect(page.locator('h1')).toContainText('MedConnect Admin Control Panel');

    // 3. Verify statistics totals
    await expect(page.locator('text=Total Patients')).toBeVisible();
    await expect(page.locator('text=Total Doctors')).toBeVisible();
    await expect(page.locator('text=Total Appointments')).toBeVisible();

    // 4. Toggle between tabs and verify contents load
    // Patients tab
    await page.click('button:has-text("Patients Directory")');
    await expect(page.locator('th:has-text("Patient Name")')).toBeVisible();
    await expect(page.locator('td:has-text("Rahul Verma")')).toBeVisible();

    // Appointments tab
    await page.click('button:has-text("Appointments Registry")');
    await expect(page.locator('th:has-text("Assigned Doctor")')).toBeVisible();

    // System Analytics tab & Dynamic Filters
    await page.click('button:has-text("System Analytics")');
    await expect(page.locator('h2:has-text("System Metrics & Analytics")')).toBeVisible();
    await expect(page.locator('text=Appointments Booking Distribution')).toBeVisible();

    // Test Date Range filter changing to 30 days and All Time
    await page.selectOption('select#analytics-date-range', '30');
    await page.waitForTimeout(500);
    await page.selectOption('select#analytics-date-range', 'all');
    await page.waitForTimeout(500);

    // Doctors tab (Default)
    await page.click('button:has-text("Doctors Directory")');
    await expect(page.locator('th:has-text("Doctor Details")')).toBeVisible();

    // 5. Logout
    await page.click('button:has-text("Logout")');
  });

});
