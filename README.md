# Employee Management Portal

A production-ready employee management application built with Next.js 14, React 18, TypeScript, Redux Toolkit, and TanStack Table.

## Features

### Authentication
- Secure login with hardcoded credentials (admin@test.com / Admin@123)
- JWT-like token-based session persistence via localStorage
- Protected routes with middleware and client-side guards
- Automatic redirect to login for unauthenticated users

### Employee Management
- **Employee Listing**: Paginated, sortable, and filterable table view
- **Search**: Real-time search by name or email with debouncing
- **Filters**: Filter by department and status
- **Sorting**: Sort by name, email, department, or designation
- **Pagination**: Configurable page sizes with navigation controls
- **Dashboard Stats**: Summary cards showing total, active, inactive employees and departments
- **Employee Details**: Comprehensive view with contact, company, and address information
- **Add Employee**: Form with validation to create new employees (stored in localStorage)

### State Preservation (Critical Feature)
- Search text, filters, sort preferences, and page number are preserved in sessionStorage
- Users resume exactly where they left off when navigating back from employee details
- State is automatically restored on page reload

### Responsive Design
- **Desktop**: Full-featured table layout with TanStack Table
- **Mobile**: Card-based layout with all functionality maintained
- Adaptive sidebar navigation with mobile overlay

### Technical Highlights
- **Redux Toolkit**: Centralized state management with slices for auth, employees, and UI
- **TanStack Table**: Advanced table features with sorting, filtering, and pagination
- **TypeScript**: Strict type safety throughout with no `any` types
- **Reusable Components**: Input, Select, Button, Card, Pagination, Toast, Skeleton
- **API Service Layer**: Centralized API calls with error handling
- **Custom Hooks**: useAuth, useEmployee, useUI for clean component logic
- **Debounced Search**: Optimized search performance
- **Loading States**: Skeleton loaders for better UX
- **Toast Notifications**: User feedback for actions
- **Form Validation**: Real-time validation with clear error messages

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + React Redux
- **Table**: TanStack Table (React Table v8)
- **Icons**: Lucide React
- **Data Source**: DummyJSON API

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── employees/         # Employee listing
│   ├── employees/[id]/    # Employee details
│   ├── employees/add/     # Add employee form
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirect)
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── StatCard.tsx
│   │   ├── Pagination.tsx
│   │   ├── Toast.tsx
│   │   └── Skeleton.tsx
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── auth/              # Auth components
│   │   └── LoginForm.tsx
│   └── employees/         # Employee components
│       ├── EmployeeTable.tsx
│       ├── EmployeeCard.tsx
│       ├── EmployeeFilters.tsx
│       ├── EmployeeStats.tsx
│       └── EmployeeForm.tsx
├── services/              # API services
│   ├── api.ts             # Base API service
│   └── employee.ts        # Employee service
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useEmployee.ts
│   └── useUI.ts
├── store/                   # Redux store
│   ├── index.ts             # Store configuration
│   └── slices/
│       ├── authSlice.ts
│       ├── employeeSlice.ts
│       └── uiSlice.ts
├── types/                   # TypeScript types
│   ├── auth.ts
│   ├── employee.ts
│   └── ui.ts
├── constants/               # Constants
│   ├── auth.ts
│   └── employee.ts
├── utils/                   # Utilities
│   ├── helpers.ts
│   └── validation.ts
├── lib/                     # Library configs
│   └── redux-provider.tsx   # Redux Provider wrapper
└── middleware.ts            # Next.js middleware
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Extract the ZIP file** and navigate to the project directory:
```bash
cd employee-management-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser** and navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## Demo Credentials

- **Email**: admin@test.com
- **Password**: Admin@123

## Technical Decisions

### Why Redux Toolkit?
- **Predictable state management**: Single source of truth for application state
- **DevTools support**: Excellent debugging experience with time-travel debugging
- **Middleware**: Built-in thunk support for async actions
- **State persistence**: Easy integration with sessionStorage for critical state preservation
- **Scalability**: Well-suited for larger applications with complex state interactions

### Why TanStack Table?
- **Headless architecture**: Full control over styling and markup
- **Performance**: Virtualization-ready with efficient rendering
- **Features**: Built-in sorting, filtering, and pagination APIs
- **TypeScript**: Excellent type support
- **Flexibility**: Works with any UI framework

### Why App Router over Pages Router?
- **Server Components**: Better performance with reduced client-side JavaScript
- **Nested Layouts**: Shared UI between routes without re-rendering
- **Middleware**: Route-level protection before rendering
- **Future-proof**: Next.js is pushing App Router as the default

### State Preservation Strategy
- **sessionStorage**: Used for employee listing state (filters, sort, pagination)
- **localStorage**: Used for auth state and locally added employees
- **Why sessionStorage for listing state?**: Persists across page reloads but clears when tab closes, which is appropriate for temporary UI state
- **Why localStorage for auth?**: Auth state should persist across sessions

### Data Flow
1. API data is fetched from DummyJSON and mapped to our Employee domain model
2. Locally added employees are stored in localStorage and merged with API data
3. Filtering and sorting happen on the client side for responsiveness
4. Pagination is calculated based on filtered results

## Assumptions Made

1. **DummyJSON API**: Used as the primary data source. The API provides user data that we map to employee domain model.
2. **Local Storage for New Employees**: Since there's no backend for adding employees, new employees are stored in localStorage and merged with API data.
3. **Status Assignment**: API users don't have a status field, so we randomly assign active/inactive status (70% active) for demonstration.
4. **No Edit/Delete**: The requirements specified only "Add Employee" - no edit or delete functionality was requested.
5. **Single User**: Only one admin user is supported with hardcoded credentials.
6. **No Image Upload**: Employee avatars are generated as initials-based placeholders.

## Third-Party Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| next | 14.2.3 | React framework with App Router |
| react | 18.3.1 | UI library |
| react-dom | 18.3.1 | React DOM renderer |
| @reduxjs/toolkit | 2.2.5 | State management |
| react-redux | 9.1.2 | React bindings for Redux |
| @tanstack/react-table | 8.17.3 | Headless table component |
| tailwindcss | 3.4.4 | Utility-first CSS framework |
| lucide-react | 0.394.0 | Icon library |
| clsx | 2.1.1 | Conditional class names |
| tailwind-merge | 2.3.0 | Merge Tailwind classes |

## Performance Optimizations

1. **React.memo**: All components are designed to be memoizable with proper prop comparison
2. **Debounced Search**: 300ms debounce on search input to reduce API calls
3. **useMemo**: Heavy computations (filtering, sorting) are memoized
4. **Lazy Loading**: Components could be split with dynamic imports for larger apps
5. **Skeleton Loaders**: Better perceived performance during data fetching

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Built for technical assessment purposes.
