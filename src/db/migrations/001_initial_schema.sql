-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest');
CREATE TYPE project_category AS ENUM ('ml', 'fullstack', 'frontend', 'backend', 'research', 'ai', 'dsa', 'tutor', 'other');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'on_hold', 'cancelled');
CREATE TYPE content_status AS ENUM ('published', 'draft', 'archived');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(title) > 0),
    description TEXT NOT NULL CHECK (length(description) > 0),
    long_description TEXT, -- for detailed project pages
    category project_category NOT NULL,
    status project_status NOT NULL DEFAULT 'active',
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPZ DEFAULT NOW(),
    updated_at TIMESTAMPZ DEFAULT NOW()
);

-- Create blog posts table (for future use)
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(title) > 0),
    slug TEXT UNIQUE NOT NULL CHECK (length(slug) > 0),
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    status content_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    
);