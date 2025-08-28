# Tahil - Learning Center Management System

A modern Angular-based learning center management application built with Angular, featuring a comprehensive UI component library and Arabic language support.

## 🚀 Core Functionality
- **UI Controls Module**: Comprehensive component showcase and testing
- **Responsive Layout**: Header, sidebar navigation, and footer components
- **Arabic Language Support**: RTL layout and Arabic text support
- **Loading Management**: Custom loader service with configurable states
- **Notification System**: Integrated notification component

## 🛠️ Technology Stack
- **Framework**: Angular 20.1.1
- **UI Library**: PrimeNG 20.0.0
- **CSS Framework**: Bootstrap 5.1.3
- **Icons**: FontAwesome 5.15.1, PrimeIcons 7.0.0
- **Loading**: ngx-ui-loader 13.0.0
- **Language**: TypeScript 5.8.2
- **Styling**: SCSS
- **Utilities**: jQuery 3.6.0, RxJS 7.8.0

## 📁 Project Structure

```
src/
├── app/
│   ├── layout/                # Layout components
│   ├── modules/               
│   │   ├── dashboard/         # Dashboard functionality
│   │   ├── course/            # Courses feature
│   │   ├── ui-controls/       # UI component showcase & testing
│   │   └── shared/            
│   │       ├── components/    # Reusable UI components
│   │       ├── buttons/       # Action button components
│   │       ├── services/      # Shared services
│   │       ├── models/        # Data models & interfaces
│   │       ├── enums/         # Shared Component enums
│   │       └── props/         # Shared Component properties
│   ├── app.config.ts          # Application configuration
│   ├── app.routes.ts          # Routing configuration
│   └── app.ts                 # Root application component
├── assets/
│   ├── css/                   # Global styles
│   │   ├── styles.scss        # Main styles
│   │   ├── styles-ar.scss     # Arabic RTL styles
│   │   └── theme.scss         # Theme configuration
│   ├── fonts/                 # Custom fonts
│   ├── icons/                 # Application icons
│   ├── images/                # Static images & logos
│   └── scripts/               # Custom JavaScript
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Angular CLI 20.1.1

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tahil
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/` to view the application.

## 🏗️ Development

### Available Scripts

```bash
# Development server
npm start
ng serve

# Build for production
npm run build
ng build

# Build with watch mode
npm run watch
ng build --watch --configuration development

# Run unit tests
npm test
ng test
```

### Code Scaffolding

Generate new components, services, or other Angular artifacts:

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name

# Generate a new module
ng generate module module-name

# See all available schematics
ng generate --help
```

## 🎨 Shared UI Components

### Data Grid
- Sortable columns with multiple data types
- Text filtering capabilities
- Pagination support with configurable page sizes
- Action buttons (View, Edit, Delete) per row
- Customizable column configurations
- Color-coded status indicators

### Form Controls
- **Dropdown**: Configurable select component with search
- **Switch**: Toggle component with custom styling
- **Progress Bar**: Loading and progress indicators

### Action Buttons
- **Add Button**: Primary action button with icon support
- **Save Button**: Form submission with loading states
- **Cancel Button**: Secondary action with confirmation

### Layout Components
- **Card Container**: Content wrapper with header/footer
- **Delete Confirmation**: Modal dialog with customizable messages
- **Header/Sidebar/Footer**: Responsive layout structure

## 🌐 Internationalization

The application supports Arabic language with:
- **RTL (Right-to-Left) layout support**: Complete layout mirroring
- **Arabic text and labels**: Localized content throughout
- **Custom Arabic fonts**: DINNextLTArabic font family
- **Language selection component**: Dynamic language switching
- **Arabic-specific styling**: Dedicated SCSS file for RTL support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [Angular documentation](https://angular.dev/)
- Review [PrimeNG documentation](https://primeng.org/)
- Open an issue in the repository

---

**Tahil** - Empowering learning centers with modern web technology.
