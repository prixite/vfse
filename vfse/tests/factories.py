from datetime import datetime

import factory
import factory.fuzzy
from faker import Faker
from pytz import UTC

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
    name = fake.color_name()

    class Meta:
        model = models.Category


class DocumentFactory(factory.django.DjangoModelFactory):
    favorite = factory.Faker("boolean")
    text = factory.Faker("text")
    title = factory.Faker("sentence")

    @factory.post_generation
    def categories(self, created, extracted, **kwargs):
        if not created:
            return

        if extracted:
            for category in extracted:
                self.categories.add(category)

    class Meta:
        model = models.Document


class TopicFactory(factory.django.DjangoModelFactory):
    title = factory.Faker("job")
    description = factory.Faker("paragraph")

    class Meta:
        model = models.Topic

    @factory.post_generation
    def followers(self, create, extracted, **kwargs):
        if not create:
            return

        for user in extracted or []:
            self.followers.add(user)

    @factory.post_generation
    def categories(self, create, extracted, **kwargs):
        if not create:
            return

        for category in extracted or []:
            self.categories.add(category)


class CommentFactory(factory.django.DjangoModelFactory):
    comment = factory.Faker("paragraph")

    class Meta:
        model = models.Comment


class WorkOrderFactory(factory.django.DjangoModelFactory):
    description = factory.Faker("paragraph")
    work_started_at = factory.fuzzy.FuzzyDateTime(datetime(2015, 1, 1, tzinfo=UTC))

    class Meta:
        model = models.WorkOrder
