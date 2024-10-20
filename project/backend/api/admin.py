from django.contrib import admin
from .models import Book, Image, ImageType

# Register your models here.

# Optionally, customize the admin display by creating a ModelAdmin class
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date')  # Customize columns shown in admin list view
    search_fields = ('title', 'author')  # Add search fields
    list_filter = ('published_date',)  # Adds a filter on published_date
    ordering = ('-published_date',)    # Orders by published_date in descending order

class ImageTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')  # Customize columns shown in admin list view

class ImageAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'file', 'created_at')  # Customize columns shown in admin list view
    search_fields = ('name', 'type', 'file')  # Add search fields
    list_filter = ('created_at',)  # Adds a filter on published_date
    ordering = ('-created_at',)    # Orders by published_date in descending order

# Register the model with the admin site
admin.site.register(Book, BookAdmin)
admin.site.register(ImageType, ImageTypeAdmin)
admin.site.register(Image, ImageAdmin)



