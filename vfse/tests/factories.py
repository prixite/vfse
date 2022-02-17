import random

import factory

from core.models import User
from vfse import models


class FolderFactory(factory.django.DjangoModelFactory):
    name = factory.Faker("name")

    @factory.post_generation
    def category(self, created, extracted, **kwargs):
        if not created:
            return
        self.category.add(extracted)

    class Meta:
        model = models.Folder


class CategoryFactory(factory.django.DjangoModelFactory):
    name = factory.Faker("name")
    folder = factory.RelatedFactoryList(
        FolderFactory,
        factory_related_name="category",
        size=lambda: random.randint(2, 5),  # nosec
    )

    class Meta:
        model = models.Category


class DocumentFactory(factory.django.DjangoModelFactory):
    folder = factory.Iterator(models.Folder.objects.all())
    text = factory.Faker("sentence")
    created_by = factory.Iterator(User.objects.filter(is_lambda_user=False))

    class Meta:
        model = models.Document
