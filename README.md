# Doctor Appointment Management System

A complete full-stack web application for managing doctor appointments. Built with **Spring Boot** (Backend) and **React with Vite** (Frontend), featuring JWT authentication, role-based access control, and PostgreSQL database.Deployed in AWS cloud frontend in S3, Backend in EC2 and Database in RDS.

## 🚀 Features

- **User Authentication**: Register and login with JWT tokens
- **Role-Based Access**: Patient, Doctor, and Admin roles
- **Doctor Management**: Browse and search doctors by specialization
- **Appointment Booking**: Patients can book appointments with doctors
- **Appointment Management**: View, update, and cancel appointments
- **Doctor Availability**: Doctors can set their availability schedule
- **Admin Panel**: Manage users and doctors
- **Modern UI**: Responsive design with Tailwind CSS
- **API Documentation**: RESTful API with clear endpoints

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java**: JDK 17 or higher
- **Maven**: 3.6 or higher
- **Node.js**: 18.x or higher (with npm)
- **PostgreSQL**: 12 or higher
- **Git**: Latest version

## 🏗️ Project Structure

```
doctor-appointment-system/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/doctorapp/
│   │   │   │   ├── config/           # Security & app configuration
│   │   │   │   ├── controller/       # REST API endpoints
│   │   │   │   ├── service/          # Business logic
│   │   │   │   ├── repository/       # Data access layer
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── security/         # JWT & authentication
│   │   │   │   ├── exception/        # Custom exceptions
│   │   │   │   └── DoctorAppApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml   # Configuration
│   │   └── test/
│   └── pom.xml                       # Maven dependencies
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API service layer
│   │   ├── context/                  # React context (Auth)
│   │   ├── routes/                   # Route protection
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                       # Static assets
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
├── .env                              # Environment variables
└── README.md
```

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
# Using PostgreSQL CLI
createdb doctor_db -U postgres
```

Or using pgAdmin:
1. Open pgAdmin
2. Create new database named `doctor_db`

### 2. Database Schema

The application automatically creates tables on startup using JPA/Hibernate. Tables created:

- `users` - User accounts with roles
- `patients` - Patient profiles
- `doctors` - Doctor profiles
- `doctor_availability` - Doctor schedules
- `appointments` - Appointment records

## 🔧 Environment Configuration

### Create `.env` file in project root:

```env
POSTGRES_DB=doctor_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Tirth_22
POSTGRES_PORT=5432
```

The `.env` file is already created with your credentials.

## 🚀 Backend Setup (Spring Boot)

### 1. Navigate to backend directory

```bash
cd doctor-appointment-system/backend
```

### 2. Build the project

```bash
mvn clean install
```

### 3. Run the application

```bash
mvn spring-boot:run
```

Or using Maven wrapper:
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Verify Backend is Running

Visit: `http://localhost:8080/actuator/health`

Expected response:
```json
{
  "status": "UP"
}
```

## 🎨 Frontend Setup (React + Vite)

### 1. Navigate to frontend directory

```bash
cd doctor-appointment-system/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000` and open automatically.

### 4. Build for production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 🔑 API Endpoints

### Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get current user
POST   /api/auth/logout          - User logout
```

### Doctors (Public)

```
GET    /api/doctors              - Get all doctors
GET    /api/doctors/{id}         - Get doctor by ID
GET    /api/doctors/search       - Search doctors by specialization
PUT    /api/doctors/{userId}     - Update doctor profile (Auth required)
```

### Appointments

```
POST   /api/appointments         - Book appointment (Auth required)
GET    /api/appointments/my      - Get user's appointments (Auth required)
GET    /api/appointments/{id}    - Get appointment details (Auth required)
PUT    /api/appointments/{id}/status - Update appointment status (Auth required)
DELETE /api/appointments/{id}    - Cancel appointment (Auth required)
```

### Doctor Availability

```
POST   /api/availability         - Add availability (Auth required)
GET    /api/availability/doctor/{doctorId} - Get doctor availability
GET    /api/availability/doctor/{doctorId}/day/{dayOfWeek} - Get by day
DELETE /api/availability/{id}    - Delete availability (Auth required)
```

### Admin (Admin only)

```
GET    /api/admin/users          - Get all users
GET    /api/admin/users/role/{role} - Get users by role
DELETE /api/admin/user/{userId}  - Delete user
```

## 🔐 Authentication Flow

1. **Register/Login**: User submits credentials
2. **JWT Token**: Server generates JWT token
3. **Token Storage**: Token saved in localStorage
4. **API Requests**: Token included in `Authorization: Bearer <token>` header
5. **Token Validation**: Server validates token on each request
6. **Auto-logout**: Invalid/expired token redirects to login

## 👥 User Roles & Permissions

### Patient
- Browse doctors
- Search doctors by specialization
- Book appointments
- View own appointments
- Cancel appointments

### Doctor
- View appointment requests
- Update appointment status (Accept/Reject)
- Set availability schedule
- View own profile

### Admin
- View all users
- View all doctors
- Delete users
- Manage system

## 🧪 Testing the Application

### Register as Patient

1. Go to `http://localhost:3000/register`
2. Fill form:
   - Name: John Patient
   - Email: patient@example.com
   - Password: password123
   - Role: Patient
3. Click Sign Up

### Login

1. Go to `http://localhost:3000/login`
2. Email: patient@example.com
3. Password: password123
4. Click Login

### Book Appointment

1. Go to Doctors page
2. Click "Book Appointment" on any doctor
3. Select date, time, and add notes
4. Click "Book Appointment"
5. View in "Appointments" page

## 📦 Technologies Used

### Backend
- **Spring Boot 3.2.3** - Framework
- **Spring Data JPA** - ORM
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **PostgreSQL** - Database
- **Maven** - Build tool
- **Lombok** - Code generation
- **Validation** - Input validation

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Port 8080 already in use
```bash
# Change port in application.yml
server:
  port: 8081
```

**Problem**: Database connection failed
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `doctor_db` exists

**Problem**: JWT validation fails
- Check JWT secret in application.yml
- Ensure token is sent in Authorization header
- Verify token hasn't expired

### Frontend Issues

**Problem**: Port 3000 already in use
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

**Problem**: API calls fail
- Verify backend is running on port 8080
- Check network tab in browser DevTools
- Verify CORS is enabled in SecurityConfig

**Problem**: Blank page
- Clear browser cache
- Check browser console for errors
- Verify Node.js version is 18+

## 📚 API Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new collection "Doctor App"
3. Add requests:
   - **POST** `http://localhost:8080/api/auth/register`
   - **POST** `http://localhost:8080/api/auth/login`
   - **GET** `http://localhost:8080/api/doctors`
   - Set Authorization header: `Bearer <token>`

## 🔒 Security Features

- ✅ Password hashing with BCrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation (DTO validation)
- ✅ Exception handling
- ✅ Secure password requirements

## 📝 Default Test Credentials

The system creates test data automatically. After startup:

```
Patient:
Email: patient@example.com
Password: password123

Doctor:
Email: doctor@example.com
Password: password123
```

You can create new accounts via registration page.

## 🎯 Next Steps & Enhancements

- [ ] Email notifications for appointments
- [ ] Video consultation feature
- [ ] Payment integration
- [ ] Reviews and ratings
- [ ] Prescription management
- [ ] Telemedicine
- [ ] Mobile application
- [ ] Analytics dashboard
- [ ] Appointment reminders
- [ ] Multi-language support

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For issues and questions:
1. Check the troubleshooting section
2. Review code comments
3. Check Spring Boot & React documentation
4. Review API endpoints documentation above

## 🎓 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [JWT Authentication](https://jwt.io)
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Happy Coding!** 🚀

For more information or issues, please refer to the documentation or create an issue in the repository.
