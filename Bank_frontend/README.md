# Bank Management System - Angular Frontend

A modern, responsive Angular frontend for a bank management system with Spring Boot backend integration.

## Features

### Authentication & Authorization
- User Registration with form validation
- Secure Login system
- Route guards for protected pages
- Session management with localStorage

### Customer Services
- Check account balance in real-time
- Deposit money with transaction recording
- Withdraw money with balance validation
- View customer profile information

### Account Management
- View detailed account information
- Complete transaction history with filtering
- Deposit and withdrawal operations
- Balance update functionality
- Interest calculation tool
- Send notifications to account holders

### User Interface
- Modern, responsive design with gradient themes
- Mobile-first approach with responsive layouts
- Real-time form validation with error messages
- Loading states and success/error notifications
- Tab-based navigation for better UX
- Beautiful animations and transitions

## Technology Stack

- **Angular 20.x** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Angular Reactive Forms** - Form handling and validation
- **Angular Router** - Navigation and routing
- **Angular HTTP Client** - API communication
- **CSS3** - Styling with gradients and animations

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)
- Spring Boot backend running on http://localhost:8090

## Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

3. **Open in browser**
   Navigate to http://localhost:4200

## Backend Configuration

Make sure your Spring Boot backend is running on `http://localhost:8090` with the following endpoints:

### Customer Controller (`/customer`)
- `POST /register` - Register new customer
- `POST /login` - Customer login
- `GET /balance/{accountNo}` - Check balance
- `POST /deposit` - Deposit money
- `POST /withdraw` - Withdraw money

### Account Controller (`/account`)
- `POST /add` - Add new account
- `GET /{accountNo}` - Get account details
- `PUT /update` - Update balance
- `GET /transactions/{accountNo}` - Get transaction history
- `GET /interest` - Calculate interest
- `POST /notify` - Send notification
- `POST /deposit` - Deposit money
- `POST /withdraw` - Withdraw money

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── customer/
│   │   └── account/
│   ├── models/
│   │   ├── customer.model.ts
│   │   ├── account.model.ts
│   │   └── transaction.model.ts
│   ├── services/
│   │   ├── customer.service.ts
│   │   ├── account.service.ts
│   │   └── auth.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── cors.interceptor.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── styles.css
└── index.html
```

## Component Overview

### LoginComponent
- User authentication with email and password
- Form validation and error handling
- Redirects to dashboard on successful login

### RegisterComponent
- New customer registration
- Comprehensive form validation (PAN, phone, email)
- Account number and customer ID assignment

### DashboardComponent
- User welcome screen with account balance
- Quick navigation to customer and account services
- Account information display

### CustomerComponent
- Balance checking functionality
- Deposit and withdrawal operations
- Real-time balance updates
- Transaction success/error messages

### AccountComponent
- Tabbed interface for different services
- Transaction history with date/time stamps
- Account operations (deposit, withdraw, update balance)
- Additional services (interest calculation, notifications)

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Environment Configuration

Update the API base URLs in service files if your backend runs on different ports:

```typescript
// In service files
private baseUrl = 'http://localhost:8090/customer'; // Update as needed
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
