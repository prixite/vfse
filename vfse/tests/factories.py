import random

import factory
from faker import Faker

from core.models import User
from vfse import models

fake = Faker()
fake.seed_instance(1234)


class FolderFactory(factory.django.DjangoModelFactory):
    name = factory.Faker("job")

    @factory.post_generation
    def category(self, created, extracted, **kwargs):
        if not created:
            return
        self.categories.add(extracted)

    class Meta:
        model = models.Folder


class CategoryFactory(factory.django.DjangoModelFactory):
    name = factory.Faker("color")
    folder = factory.RelatedFactoryList(
        FolderFactory,
        factory_related_name="category",
        size=lambda: random.randint(2, 5),  # nosec
    )

    class Meta:
        model = models.Category


class DocumentFactory(factory.django.DjangoModelFactory):
    folder = factory.Iterator(models.Folder.objects.all())
    favorite = factory.Faker("boolean")
    text = factory.Faker("text")
    created_by = factory.Iterator(User.objects.filter(is_lambda_user=False))

    class Meta:
        model = models.Document
