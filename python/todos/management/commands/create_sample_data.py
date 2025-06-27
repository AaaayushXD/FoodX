from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from todos.models import Todo


class Command(BaseCommand):
    help = 'Create sample todo data for testing'

    def handle(self, *args, **options):
        # Sample todo data
        sample_todos = [
            {
                'title': 'Complete Django Project',
                'description': 'Finish building the todo application with all CRUD operations and modern UI design.',
                'status': 'in_progress',
                'completed': False,
                'due_date': timezone.now() + timedelta(days=7)
            },
            {
                'title': 'Learn Tailwind CSS',
                'description': 'Study Tailwind CSS framework for modern web development and responsive design.',
                'status': 'completed',
                'completed': True,
                'due_date': timezone.now() - timedelta(days=2)
            },
            {
                'title': 'Setup Development Environment',
                'description': 'Install Python, Django, and configure the development environment.',
                'status': 'completed',
                'completed': True,
                'due_date': timezone.now() - timedelta(days=5)
            },
            {
                'title': 'Write Documentation',
                'description': 'Create comprehensive README and API documentation for the project.',
                'status': 'pending',
                'completed': False,
                'due_date': timezone.now() + timedelta(days=3)
            },
            {
                'title': 'Deploy to Production',
                'description': 'Deploy the application to a production server with proper configuration.',
                'status': 'pending',
                'completed': False,
                'due_date': timezone.now() + timedelta(days=14)
            },
            {
                'title': 'Add User Authentication',
                'description': 'Implement user registration, login, and authentication system.',
                'status': 'pending',
                'completed': False,
                'due_date': timezone.now() + timedelta(days=10)
            },
            {
                'title': 'Create Unit Tests',
                'description': 'Write comprehensive unit tests for all views and models.',
                'status': 'in_progress',
                'completed': False,
                'due_date': timezone.now() + timedelta(days=5)
            },
            {
                'title': 'Optimize Database Queries',
                'description': 'Review and optimize database queries for better performance.',
                'status': 'pending',
                'completed': False,
                'due_date': timezone.now() + timedelta(days=8)
            }
        ]

        # Create todos
        created_count = 0
        for todo_data in sample_todos:
            todo, created = Todo.objects.get_or_create(
                title=todo_data['title'],
                defaults=todo_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created todo: {todo.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} sample todos!'
            )
        ) 