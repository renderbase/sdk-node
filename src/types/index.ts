/**
 * Renderbase SDK Types
 */

// ============================================
// Configuration Types
// ============================================

export interface RenderbaseConfig {
  /** API Key for authentication */
  apiKey: string;
  /** Base URL for the API (default: https://api.renderbase.dev) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Custom headers to include in requests */
  headers?: Record<string, string>;
}

// ============================================
// Document Types
// ============================================

export interface GenerateDocumentOptions {
  /** Template ID to use */
  templateId: string;
  /** Output format */
  format: 'pdf' | 'excel';
  /** Template variables for content generation */
  variables?: Record<string, unknown>;
  /** Workspace ID to generate document in (optional, defaults to user's current workspace) */
  workspaceId?: string;
  /** Webhook URL to receive completion notification */
  webhookUrl?: string;
  /** Secret for webhook signature verification */
  webhookSecret?: string;
  /** Custom metadata to pass through to webhook */
  metadata?: Record<string, unknown>;
}

export interface GenerateBatchOptions {
  /** Template ID to use */
  templateId: string;
  /** Output format */
  format: 'pdf' | 'excel';
  /** List of documents to generate */
  documents: BatchDocument[];
  /** Workspace ID to generate documents in (optional, defaults to user's current workspace) */
  workspaceId?: string;
  /** Webhook URL to receive batch completion notification */
  webhookUrl?: string;
  /** Secret for webhook signature verification */
  webhookSecret?: string;
}

export interface BatchDocument {
  /** Template variables for this document */
  variables?: Record<string, unknown>;
  /** Custom metadata for this document */
  metadata?: Record<string, unknown>;
}

export interface GenerateDocumentResponse {
  /** Job ID for tracking */
  jobId: string;
  /** Job status */
  status: DocumentJobStatus;
  /** Signed download URL (available when completed) */
  downloadUrl?: string;
  /** URL expiration time */
  expiresAt?: string;
  /** Created timestamp */
  createdAt: string;
}

export interface GenerateBatchResponse {
  /** Batch ID for tracking */
  batchId: string;
  /** Batch status */
  status: string;
  /** Total documents in batch */
  totalDocuments: number;
  /** Number of completed documents */
  completed: number;
  /** Number of failed documents */
  failed: number;
  /** Created timestamp */
  createdAt: string;
}

export interface DocumentJob {
  /** Job ID */
  id: string;
  /** Job status */
  status: DocumentJobStatus;
  /** Output format */
  format: 'pdf' | 'excel';
  /** Template ID used */
  templateId: string;
  /** Template name */
  templateName?: string;
  /** Signed download URL (available when completed) */
  downloadUrl?: string;
  /** URL expiration time */
  expiresAt?: string;
  /** File size in bytes */
  fileSize?: number;
  /** Processing duration in milliseconds */
  duration?: number;
  /** Error message (if failed) */
  error?: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
  /** Started timestamp */
  startedAt?: string;
  /** Completed timestamp */
  completedAt?: string;
  /** Created timestamp */
  createdAt: string;
  /** Updated timestamp */
  updatedAt: string;
}

export type DocumentJobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ListDocumentJobsOptions {
  /** Filter by status */
  status?: DocumentJobStatus;
  /** Filter by format */
  format?: 'pdf' | 'excel';
  /** Filter by template ID */
  templateId?: string;
  /** Filter by workspace ID */
  workspaceId?: string;
  /** Filter by date range start */
  dateFrom?: string | Date;
  /** Filter by date range end */
  dateTo?: string | Date;
  /** Number of results per page (default: 20) */
  limit?: number;
  /** Page number (default: 1) */
  page?: number;
}

// ============================================
// Template Types
// ============================================

export interface Template {
  id: string;
  name: string;
  type: 'pdf' | 'excel';
  description?: string;
  variables?: TemplateVariable[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: unknown;
}

export interface ListTemplatesOptions {
  /** Filter by template type */
  type?: 'pdf' | 'excel';
  /** Number of results per page (default: 20) */
  limit?: number;
  /** Page number (default: 1) */
  page?: number;
}

// ============================================
// Webhook Types
// ============================================

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEventType[];
  name?: string;
  active: boolean;
  secret?: string;
  createdAt: string;
  updatedAt: string;
}

export type WebhookEventType =
  | 'document.completed'
  | 'document.failed'
  | 'batch.completed';

export interface CreateWebhookOptions {
  /** URL to receive webhook events */
  url: string;
  /** Event types to subscribe to */
  events: WebhookEventType[];
  /** Webhook name (optional) */
  name?: string;
}

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

// ============================================
// Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name?: string;
  teamId?: string;
  teamName?: string;
  workspaceId?: string;
  workspaceName?: string;
}
