# Path: backend/agrivendia/utils.py
from rest_framework import serializers
import base64
import uuid
from django.core.files.base import ContentFile

class Base64ImageField(serializers.Field):
    """
    A Django REST framework field for handling image-uploads as raw post data.
    Takes a base64 string, converts it to a file, and saves it.
    """
    def to_internal_value(self, data):
        # Check if this is a base64 string
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                # format: "data:image/png;base64,iVBORw0KG..."
                header, imgstr = data.split(';base64,') 
                
                # Extract extension (png, jpg, etc.)
                ext = header.split('/')[-1] 
                
                # Generate unique name
                file_name = f"{uuid.uuid4()}.{ext}"
                
                # Decode and return ContentFile
                data = ContentFile(base64.b64decode(imgstr), name=file_name)
            except Exception as e:
                raise serializers.ValidationError(f"Invalid image format: {str(e)}")
        return data

    def to_representation(self, value):
        # Return the URL of the image
        if not value:
            return None
        try:
            return value.url
        except:
            return None