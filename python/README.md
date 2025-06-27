# Todo Web Application

A modern, responsive Todo web application built with Django and Tailwind CSS. This application provides full CRUD functionality for managing tasks with a clean, professional interface.

## Features

- ✅ **Create, Read, Update, Delete (CRUD)** operations for tasks
- 🎨 **Modern UI** with Tailwind CSS for responsive design
- 🔍 **Filtering & Search** by status and completion
- 📅 **Due Date Management** with overdue indicators
- 🏷️ **Status Tracking** (Pending, In Progress, Completed)
- ⚡ **Real-time Updates** with AJAX for task completion
- 📱 **Mobile Responsive** design
- 🔔 **User Feedback** with success/error messages
- 🎯 **Clean Architecture** with function-based views

## Tech Stack

- **Backend**: Django 4.2.7 (Function-Based Views)
- **Frontend**: Tailwind CSS (via CDN)
- **Database**: SQLite (default)
- **Forms**: Django Forms with crispy-forms
- **Styling**: Tailwind CSS with custom components

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Step 1: Clone or Download

```bash
# If you have the project files, navigate to the project directory
cd /path/to/todo-app
```

### Step 2: Create Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
# Install required packages
pip install -r requirements.txt
```

### Step 4: Environment Configuration

Create a `.env` file in the project root (optional, for production):

```env
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Step 5: Database Setup

```bash
# Create database migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create a superuser (optional, for admin access)
python manage.py createsuperuser
```

### Step 6: Run the Application

```bash
# Start the development server
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

## Usage

### Main Features

1. **View All Tasks**: Navigate to the home page to see all your tasks
2. **Create New Task**: Click "Add Task" button to create a new task
3. **Edit Task**: Click the edit icon on any task to modify it
4. **Delete Task**: Click the delete icon to remove a task (with confirmation)
5. **Toggle Completion**: Click the checkbox to mark tasks as complete/incomplete
6. **Filter Tasks**: Use the filter options to view tasks by status or completion

### Task Management

- **Title**: Required field for task identification
- **Description**: Optional detailed description
- **Status**: Choose from Pending, In Progress, or Completed
- **Due Date**: Optional deadline for the task
- **Completion**: Toggle to mark tasks as done

### Admin Interface

Access the Django admin interface at `http://127.0.0.1:8000/admin/` to:
- Manage all tasks
- View task statistics
- Bulk edit tasks
- Monitor task creation and updates

## Project Structure

```
todo_project/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── README.md                # This file
├── todo_project/            # Main Django project
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   ├── wsgi.py
│   └── asgi.py
├── todos/                   # Todo application
│   ├── __init__.py
│   ├── admin.py             # Admin interface configuration
│   ├── apps.py
│   ├── forms.py             # Form definitions
│   ├── models.py            # Todo model
│   ├── urls.py              # App URL patterns
│   └── views.py             # Function-based views
├── templates/               # HTML templates
│   ├── base.html            # Base template
│   └── todos/               # Todo-specific templates
│       ├── todo_list.html
│       ├── todo_form.html
│       ├── todo_detail.html
│       └── todo_confirm_delete.html
└── static/                  # Static files (CSS, JS, images)
    └── css/
```

## API Endpoints

| URL Pattern | View | Description |
|-------------|------|-------------|
| `/` | Redirect to todo list | Home page redirect |
| `/todos/` | `todo_list` | List all tasks |
| `/todos/create/` | `todo_create` | Create new task |
| `/todos/<id>/` | `todo_detail` | View task details |
| `/todos/<id>/edit/` | `todo_update` | Edit task |
| `/todos/<id>/delete/` | `todo_delete` | Delete task |
| `/todos/<id>/toggle/` | `todo_toggle_complete` | Toggle completion |

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the Tailwind configuration in `templates/base.html`
2. Adding custom CSS classes
3. Updating the color scheme in the configuration

### Adding Features

To extend the application, you can:

1. **Add new fields** to the Todo model in `todos/models.py`
2. **Create new views** in `todos/views.py`
3. **Add URL patterns** in `todos/urls.py`
4. **Create new templates** in `templates/todos/`

### Database

The application uses SQLite by default. To use a different database:

1. Update the `DATABASES` setting in `todo_project/settings.py`
2. Install the appropriate database adapter
3. Run migrations

## Development

### Running Tests

```bash
python manage.py test
```

### Code Style

The project follows Django best practices:
- Function-based views for simplicity
- Proper form validation
- Clean template structure
- Responsive design principles

### Security Considerations

- CSRF protection enabled
- Form validation
- SQL injection protection (Django ORM)
- XSS protection (Django template escaping)

## Deployment

For production deployment:

1. Set `DEBUG=False` in settings
2. Use a production database (PostgreSQL recommended)
3. Configure static files serving
4. Set up proper environment variables
5. Use a production WSGI server (Gunicorn, uWSGI)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the Django documentation
2. Review the code comments
3. Create an issue in the repository

---

**Built with ❤️ using Django and Tailwind CSS** 