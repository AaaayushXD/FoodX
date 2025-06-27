from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.urls import reverse
from .models import Todo
from .forms import TodoForm


def todo_list(request):
    """Display all todos with filtering options"""
    todos = Todo.objects.all()
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        todos = todos.filter(status=status_filter)
    
    # Filter by completion
    completed_filter = request.GET.get('completed')
    if completed_filter is not None:
        completed = completed_filter.lower() == 'true'
        todos = todos.filter(completed=completed)
    
    context = {
        'todos': todos,
        'status_choices': Todo.STATUS_CHOICES,
        'current_status': status_filter,
        'current_completed': completed_filter,
    }
    return render(request, 'todos/todo_list.html', context)


def todo_create(request):
    """Create a new todo"""
    if request.method == 'POST':
        form = TodoForm(request.POST)
        if form.is_valid():
            todo = form.save()
            messages.success(request, f'Task "{todo.title}" created successfully!')
            return redirect('todos:todo_list')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = TodoForm()
    
    context = {
        'form': form,
        'title': 'Create New Task',
        'button_text': 'Create Task'
    }
    return render(request, 'todos/todo_form.html', context)


def todo_update(request, pk):
    """Update an existing todo"""
    todo = get_object_or_404(Todo, pk=pk)
    
    if request.method == 'POST':
        form = TodoForm(request.POST, instance=todo)
        if form.is_valid():
            todo = form.save()
            messages.success(request, f'Task "{todo.title}" updated successfully!')
            return redirect('todos:todo_list')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = TodoForm(instance=todo)
    
    context = {
        'form': form,
        'todo': todo,
        'title': 'Edit Task',
        'button_text': 'Update Task'
    }
    return render(request, 'todos/todo_form.html', context)


def todo_delete(request, pk):
    """Delete a todo"""
    todo = get_object_or_404(Todo, pk=pk)
    
    if request.method == 'POST':
        title = todo.title
        todo.delete()
        messages.success(request, f'Task "{title}" deleted successfully!')
        return redirect('todos:todo_list')
    
    context = {
        'todo': todo
    }
    return render(request, 'todos/todo_confirm_delete.html', context)


def todo_toggle_complete(request, pk):
    """Toggle the completion status of a todo"""
    todo = get_object_or_404(Todo, pk=pk)
    
    if request.method == 'POST':
        todo.completed = not todo.completed
        todo.save()
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'completed': todo.completed,
                'message': f'Task "{todo.title}" marked as {"completed" if todo.completed else "pending"}!'
            })
        
        status = "completed" if todo.completed else "pending"
        messages.success(request, f'Task "{todo.title}" marked as {status}!')
        return redirect('todos:todo_list')
    
    return redirect('todos:todo_list')


def todo_detail(request, pk):
    """Display detailed view of a todo"""
    todo = get_object_or_404(Todo, pk=pk)
    
    context = {
        'todo': todo
    }
    return render(request, 'todos/todo_detail.html', context)
