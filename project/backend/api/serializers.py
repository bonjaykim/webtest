# backend/my_project/serializers.py

from rest_framework import serializers
from .models import Book, Image, ImageType

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class ImageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageType
        fields = ['id', 'name']

class ImageSerializer(serializers.ModelSerializer):
    type = serializers.PrimaryKeyRelatedField(queryset=ImageType.objects.all())
    type_name = serializers.CharField(source='type.name', read_only=True)
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'name', 'type', 'type_name', 'url', 'created_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None
