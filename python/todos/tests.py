from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from .models import Todo


class TodoModelTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="Test Description",
            status="pending",
            completed=False
        )

    def test_todo_creation(self):
        """Test that a todo can be created"""
        self.assertEqual(self.todo.title, "Test Todo")
        self.assertEqual(self.todo.description, "Test Description")
        self.assertEqual(self.todo.status, "pending")
        self.assertFalse(self.todo.completed)

    def test_todo_str_representation(self):
        """Test the string representation of a todo"""
        self.assertEqual(str(self.todo), "Test Todo")

    def test_status_color_property(self):
        """Test the status_color property returns correct CSS classes"""
        self.assertEqual(self.todo.status_color, "bg-yellow-100 text-yellow-800")
        
        self.todo.status = "in_progress"
        self.assertEqual(self.todo.status_color, "bg-blue-100 text-blue-800")
        
        self.todo.status = "completed"
        self.assertEqual(self.todo.status_color, "bg-green-100 text-green-800")

    def test_is_overdue_property(self):
        """Test the is_overdue property"""
        # Test with no due date
        self.assertFalse(self.todo.is_overdue)
        
        # Test with future due date
        self.todo.due_date = timezone.now() + timezone.timedelta(days=1)
        self.assertFalse(self.todo.is_overdue)
        
        # Test with past due date
        self.todo.due_date = timezone.now() - timezone.timedelta(days=1)
        self.assertTrue(self.todo.is_overdue)
        
        # Test with completed todo (should not be overdue)
        self.todo.completed = True
        self.assertFalse(self.todo.is_overdue)


class TodoViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="Test Description",
            status="pending",
            completed=False
        )

    def test_todo_list_view(self):
        """Test the todo list view"""
        response = self.client.get(reverse('todos:todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Todo")

    def test_todo_create_view(self):
        """Test the todo create view"""
        response = self.client.get(reverse('todos:todo_create'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Create New Task")

    def test_todo_detail_view(self):
        """Test the todo detail view"""
        response = self.client.get(reverse('todos:todo_detail', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test Todo")

    def test_todo_update_view(self):
        """Test the todo update view"""
        response = self.client.get(reverse('todos:todo_update', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Edit Task")

    def test_todo_delete_view(self):
        """Test the todo delete view"""
        response = self.client.get(reverse('todos:todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Delete Task")

    def test_create_todo_post(self):
        """Test creating a todo via POST"""
        data = {
            'title': 'New Todo',
            'description': 'New Description',
            'status': 'pending',
        }
        response = self.client.post(reverse('todos:todo_create'), data)
        self.assertEqual(response.status_code, 302)  # Redirect after success
        
        # Check if todo was created
        todo = Todo.objects.get(title='New Todo')
        self.assertEqual(todo.description, 'New Description')

    def test_update_todo_post(self):
        """Test updating a todo via POST"""
        data = {
            'title': 'Updated Todo',
            'description': 'Updated Description',
            'status': 'in_progress',
        }
        response = self.client.post(reverse('todos:todo_update', args=[self.todo.pk]), data)
        self.assertEqual(response.status_code, 302)  # Redirect after success
        
        # Check if todo was updated
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated Todo')
        self.assertEqual(self.todo.status, 'in_progress')

    def test_delete_todo_post(self):
        """Test deleting a todo via POST"""
        response = self.client.post(reverse('todos:todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)  # Redirect after success
        
        # Check if todo was deleted
        self.assertFalse(Todo.objects.filter(pk=self.todo.pk).exists())

    def test_toggle_complete(self):
        """Test toggling todo completion"""
        response = self.client.post(reverse('todos:todo_toggle_complete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)  # Redirect after success
        
        # Check if completion was toggled
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.completed)
