import factory
from faker import Faker

from core.models import User
from vfse import models

fake = Faker()
fake.seed_instance(1234)


class FolderFactory(factory.django.DjangoModelFactory):
    name = fake.unique.job()

    @factory.post_generation
    def categories(self, created, extracted, **kwargs):
        if not created:
            return

        if extracted:
            for category in extracted:
                self.categories.add(category)

    class Meta:
        model = models.Folder


class CategoryFactory(factory.django.DjangoModelFactory):
    name = fake.unique.color()

    class Meta:
        model = models.Category


class DocumentFactory(factory.django.DjangoModelFactory):
    favorite = factory.Faker("boolean")
    text = factory.Faker("text")
    title = factory.Faker("sentence")
    created_by = factory.Iterator(User.objects.filter(is_lambda_user=False))

    @factory.post_generation
    def categories(self, created, extracted, **kwargs):
        if not created:
            return

        if extracted:
            for category in extracted:
                self.categories.add(category)

    class Meta:
        model = models.Document
