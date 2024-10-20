from django.urls import path
from .views import book_list_create, ImageUploadView, ImageListView, ImageTypeListView

urlpatterns = [
    path('api/books/', book_list_create, name='book-list-create'),
    # other urls...
    path('api/imageview/module/update/', ImageUploadView.as_view(), name='image-upload'),
    path('api/imageview/module/images/', ImageListView.as_view(), name='image-list'),
    path('api/imageview/module/types/', ImageTypeListView.as_view(), name='image-type-list'),

]