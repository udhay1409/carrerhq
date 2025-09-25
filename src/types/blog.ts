export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: BlogContent[];
  imageId: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Computed fields for frontend
  readTime?: string;
  authorImageId?: string;
}

export interface BlogContent {
  id?: string;
  type: "heading" | "paragraph";
  text: string;
}

export interface BlogCategory {
  id: string;
  name: string;
}

export interface CreateBlogPostData {
  title: string;
  excerpt: string;
  content: BlogContent[];
  imageId: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  published?: boolean;
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}
