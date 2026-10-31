"""
APX DIGITAL — SQLAlchemy ORM Models
Compatible with PostgreSQL & SQLite
"""

from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Integer,
    DateTime,
    ForeignKey,
    JSON,
    func
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Admin(Base):
    __tablename__ = "admins"

    id = Column(String(64), primary_key=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(128), nullable=False)
    role = Column(String(64), default="Super Administrator")
    must_change_password = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(64), primary_key=True)
    name = Column(String(128), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(64), nullable=True)
    company = Column(String(128), nullable=True)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    source = Column(String(32), default="contact", index=True)  # 'contact' | 'inquiry'
    budget = Column(String(64), nullable=True)
    timeline = Column(String(64), nullable=True)
    status = Column(String(32), default="New", index=True)      # 'New' | 'Read' | 'Replied' | 'Closed'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    replies = relationship("MessageReply", back_populates="message", cascade="all, delete-orphan")


class MessageReply(Base):
    __tablename__ = "message_replies"

    id = Column(String(64), primary_key=True)
    message_id = Column(String(64), ForeignKey("messages.id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String(255), nullable=False)
    sender_name = Column(String(128), nullable=False)
    reply_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    message = relationship("Message", back_populates="replies")


class ChatConversation(Base):
    __tablename__ = "chat_conversations"

    id = Column(String(64), primary_key=True)
    visitor_id = Column(String(64), nullable=False)
    visitor_name = Column(String(128), nullable=False)
    visitor_email = Column(String(255), nullable=True)
    status = Column(String(32), default="active", index=True)
    unread_admin = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_activity = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(64), primary_key=True)
    conversation_id = Column(String(64), ForeignKey("chat_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String(32), nullable=False)  # 'visitor' | 'admin' | 'ai'
    sender_name = Column(String(128), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("ChatConversation", back_populates="messages")


class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(String(64), primary_key=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    category = Column(String(128), nullable=False, index=True)
    technologies = Column(JSON, default=list)
    thumbnail_url = Column(Text, nullable=False)
    gallery_images = Column(JSON, default=list)
    live_url = Column(Text, nullable=True)
    github_url = Column(Text, nullable=True)
    case_study_url = Column(Text, nullable=True)
    completion_date = Column(String(64), nullable=True)
    is_featured = Column(Boolean, default=False, index=True)
    status = Column(String(32), default="Published", index=True)  # 'Published' | 'Draft'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(64), primary_key=True)
    type = Column(String(64), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True)
    type = Column(String(64), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    target_id = Column(String(64), nullable=True)
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
