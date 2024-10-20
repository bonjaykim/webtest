from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Book, Image, ImageType
from .serializers import BookSerializer, ImageSerializer, ImageTypeSerializer

@api_view(['GET', 'POST'])
def book_list_create(request):
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ImageTypeListView(APIView):
    def get(self, request):
        image_types = ImageType.objects.all()
        serializer = ImageTypeSerializer(image_types, many=True)
        return Response(serializer.data)

class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        serializer = ImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageListView(APIView):
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 16))
        offset = (page - 1) * limit

        images = Image.objects.all().order_by('-created_at')[offset:offset+limit+1]
        has_more = len(images) > limit
        images = images[:limit]

        serializer = ImageSerializer(images, many=True, context={'request': request})
        return Response({
            'images': serializer.data,
            'hasMore': has_more
        })