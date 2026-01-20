/**
 * HTTP Client for RenderDocs SDK
 */
interface HttpClientConfig {
    baseUrl: string;
    apiKey: string;
    timeout: number;
    headers?: Record<string, string>;
}
declare class HttpClient {
    private config;
    constructor(config: HttpClientConfig);
    private request;
    get<T>(path: string, query?: Record<string, unknown>): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    put<T>(path: string, body?: unknown): Promise<T>;
    delete<T>(path: string): Promise<T>;
}
declare class RenderDocsError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode: number);
}

/**
 * RenderDocs SDK Types
 */
interface RenderDocsConfig {
    /** API Key for authentication */
    apiKey: string;
    /** Base URL for the API (default: https://api.renderdocs.com) */
    baseUrl?: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
    /** Custom headers to include in requests */
    headers?: Record<string, string>;
}
interface GenerateDocumentOptions {
    /** Template ID to use */
    templateId: string;
    /** Output format */
    format: 'pdf' | 'excel';
    /** Template variables for content generation */
    variables?: Record<string, unknown>;
    /** Webhook URL to receive completion notification */
    webhookUrl?: string;
    /** Secret for webhook signature verification */
    webhookSecret?: string;
    /** Custom metadata to pass through to webhook */
    metadata?: Record<string, unknown>;
}
interface GenerateBatchOptions {
    /** Template ID to use */
    templateId: string;
    /** Output format */
    format: 'pdf' | 'excel';
    /** List of documents to generate */
    documents: BatchDocument[];
    /** Webhook URL to receive batch completion notification */
    webhookUrl?: string;
    /** Secret for webhook signature verification */
    webhookSecret?: string;
}
interface BatchDocument {
    /** Template variables for this document */
    variables?: Record<string, unknown>;
    /** Custom metadata for this document */
    metadata?: Record<string, unknown>;
}
interface GenerateDocumentResponse {
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
interface GenerateBatchResponse {
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
interface DocumentJob {
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
type DocumentJobStatus = 'queued' | 'processing' | 'completed' | 'failed';
interface ListDocumentJobsOptions {
    /** Filter by status */
    status?: DocumentJobStatus;
    /** Filter by format */
    format?: 'pdf' | 'excel';
    /** Filter by template ID */
    templateId?: string;
    /** Filter by date range start */
    dateFrom?: string | Date;
    /** Filter by date range end */
    dateTo?: string | Date;
    /** Number of results per page (default: 20) */
    limit?: number;
    /** Page number (default: 1) */
    page?: number;
}
interface Template {
    id: string;
    name: string;
    type: 'pdf' | 'excel';
    description?: string;
    variables?: TemplateVariable[];
    createdAt: string;
    updatedAt: string;
}
interface TemplateVariable {
    name: string;
    type: string;
    required?: boolean;
    defaultValue?: unknown;
}
interface ListTemplatesOptions {
    /** Filter by template type */
    type?: 'pdf' | 'excel';
    /** Number of results per page (default: 20) */
    limit?: number;
    /** Page number (default: 1) */
    page?: number;
}
interface WebhookSubscription {
    id: string;
    url: string;
    events: WebhookEventType[];
    name?: string;
    active: boolean;
    secret?: string;
    createdAt: string;
    updatedAt: string;
}
type WebhookEventType = 'document.completed' | 'document.failed' | 'batch.completed';
interface CreateWebhookOptions {
    /** URL to receive webhook events */
    url: string;
    /** Event types to subscribe to */
    events: WebhookEventType[];
    /** Webhook name (optional) */
    name?: string;
}
interface WebhookEvent {
    id: string;
    type: WebhookEventType;
    timestamp: string;
    data: Record<string, unknown>;
}
interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: PaginationMeta;
}
interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface ApiError {
    success: false;
    error: string;
    message: string;
    statusCode: number;
}
interface User {
    id: string;
    email: string;
    name?: string;
    teamId?: string;
    teamName?: string;
}

/**
 * Documents Resource
 */

declare class DocumentsResource {
    private http;
    constructor(http: HttpClient);
    /**
     * Generate a document from a template
     *
     * @example
     * ```typescript
     * const result = await renderdocs.documents.generate({
     *   templateId: 'tmpl_abc123',
     *   format: 'pdf',
     *   variables: {
     *     customerName: 'John Doe',
     *     invoiceNumber: 'INV-001',
     *     amount: 150.00,
     *   },
     * });
     * console.log('Job ID:', result.jobId);
     * console.log('Download URL:', result.downloadUrl);
     * ```
     */
    generate(options: GenerateDocumentOptions): Promise<GenerateDocumentResponse>;
    /**
     * Generate a PDF document from a template
     *
     * @example
     * ```typescript
     * const result = await renderdocs.documents.generatePdf({
     *   templateId: 'tmpl_invoice',
     *   variables: {
     *     invoiceNumber: 'INV-001',
     *     total: 99.99,
     *   },
     * });
     * ```
     */
    generatePdf(options: Omit<GenerateDocumentOptions, 'format'>): Promise<GenerateDocumentResponse>;
    /**
     * Generate an Excel document from a template
     *
     * @example
     * ```typescript
     * const result = await renderdocs.documents.generateExcel({
     *   templateId: 'tmpl_report',
     *   variables: {
     *     reportDate: '2025-01-15',
     *     data: [{ name: 'Item 1', value: 100 }],
     *   },
     * });
     * ```
     */
    generateExcel(options: Omit<GenerateDocumentOptions, 'format'>): Promise<GenerateDocumentResponse>;
    /**
     * Generate multiple documents in a batch
     *
     * @example
     * ```typescript
     * const result = await renderdocs.documents.generateBatch({
     *   templateId: 'tmpl_invoice',
     *   format: 'pdf',
     *   documents: [
     *     { variables: { invoiceNumber: 'INV-001', total: 99.99 } },
     *     { variables: { invoiceNumber: 'INV-002', total: 149.99 } },
     *   ],
     * });
     * console.log('Batch ID:', result.batchId);
     * ```
     */
    generateBatch(options: GenerateBatchOptions): Promise<GenerateBatchResponse>;
    /**
     * Get a document job by ID
     *
     * @example
     * ```typescript
     * const job = await renderdocs.documents.getJob('job_abc123');
     * console.log('Status:', job.status);
     * if (job.status === 'completed') {
     *   console.log('Download:', job.downloadUrl);
     * }
     * ```
     */
    getJob(jobId: string): Promise<DocumentJob>;
    /**
     * List document jobs with optional filters
     *
     * @example
     * ```typescript
     * const { data, meta } = await renderdocs.documents.listJobs({
     *   status: 'completed',
     *   format: 'pdf',
     *   limit: 10,
     * });
     * console.log(`Found ${meta.total} jobs`);
     * ```
     */
    listJobs(options?: ListDocumentJobsOptions): Promise<{
        data: DocumentJob[];
        meta: PaginationMeta;
    }>;
    /**
     * Wait for a document job to complete
     *
     * @example
     * ```typescript
     * const result = await renderdocs.documents.generate({
     *   templateId: 'tmpl_invoice',
     *   format: 'pdf',
     *   variables: { invoiceNumber: 'INV-001' },
     * });
     *
     * // Wait for completion (polls every 1 second, max 30 seconds)
     * const completedJob = await renderdocs.documents.waitForCompletion(result.jobId);
     * console.log('Download URL:', completedJob.downloadUrl);
     * ```
     */
    waitForCompletion(jobId: string, options?: {
        pollInterval?: number;
        timeout?: number;
    }): Promise<DocumentJob>;
}

/**
 * Templates Resource
 */

declare class TemplatesResource {
    private http;
    constructor(http: HttpClient);
    /**
     * Get a template by ID
     *
     * @example
     * ```typescript
     * const template = await renderdocs.templates.get('tmpl_abc123');
     * console.log('Template:', template.name);
     * console.log('Variables:', template.variables);
     * ```
     */
    get(id: string): Promise<Template>;
    /**
     * List templates with optional filters
     *
     * @example
     * ```typescript
     * // List all PDF templates
     * const { data } = await renderdocs.templates.list({ type: 'pdf' });
     *
     * // List all Excel templates
     * const { data: excelTemplates } = await renderdocs.templates.list({ type: 'excel' });
     * ```
     */
    list(options?: ListTemplatesOptions): Promise<{
        data: Template[];
        meta: PaginationMeta;
    }>;
    /**
     * List only PDF templates
     *
     * @example
     * ```typescript
     * const { data } = await renderdocs.templates.listPdf();
     * ```
     */
    listPdf(options?: Omit<ListTemplatesOptions, 'type'>): Promise<{
        data: Template[];
        meta: PaginationMeta;
    }>;
    /**
     * List only Excel templates
     *
     * @example
     * ```typescript
     * const { data } = await renderdocs.templates.listExcel();
     * ```
     */
    listExcel(options?: Omit<ListTemplatesOptions, 'type'>): Promise<{
        data: Template[];
        meta: PaginationMeta;
    }>;
}

/**
 * Webhooks Resource
 */

declare class WebhooksResource {
    private http;
    constructor(http: HttpClient);
    /**
     * Create a webhook subscription
     *
     * @example
     * ```typescript
     * const webhook = await renderdocs.webhooks.create({
     *   url: 'https://your-app.com/webhooks/renderdocs',
     *   events: ['document.completed', 'document.failed', 'batch.completed'],
     *   name: 'My Webhook',
     * });
     * console.log('Webhook ID:', webhook.id);
     * console.log('Secret:', webhook.secret); // Save this for verification!
     * ```
     */
    create(options: CreateWebhookOptions): Promise<WebhookSubscription>;
    /**
     * Get a webhook subscription by ID
     *
     * @example
     * ```typescript
     * const webhook = await renderdocs.webhooks.get('wh_abc123');
     * console.log('Events:', webhook.events);
     * ```
     */
    get(id: string): Promise<WebhookSubscription>;
    /**
     * List all webhook subscriptions
     *
     * @example
     * ```typescript
     * const { data } = await renderdocs.webhooks.list();
     * console.log('Active webhooks:', data.filter(w => w.active).length);
     * ```
     */
    list(): Promise<{
        data: WebhookSubscription[];
        meta: PaginationMeta;
    }>;
    /**
     * Delete a webhook subscription
     *
     * @example
     * ```typescript
     * await renderdocs.webhooks.delete('wh_abc123');
     * console.log('Webhook deleted');
     * ```
     */
    delete(id: string): Promise<void>;
    /**
     * Update a webhook subscription
     *
     * @example
     * ```typescript
     * const updated = await renderdocs.webhooks.update('wh_abc123', {
     *   events: ['document.completed', 'document.failed'],
     *   active: true,
     * });
     * ```
     */
    update(id: string, options: Partial<CreateWebhookOptions> & {
        active?: boolean;
    }): Promise<WebhookSubscription>;
}

/**
 * RenderDocs SDK Client
 */

declare class RenderDocs {
    private http;
    /** Document generation operations */
    documents: DocumentsResource;
    /** Template operations */
    templates: TemplatesResource;
    /** Webhook operations */
    webhooks: WebhooksResource;
    /**
     * Create a new RenderDocs client
     *
     * @example
     * ```typescript
     * import { RenderDocs } from '@renderdocs/sdk';
     *
     * const renderdocs = new RenderDocs({
     *   apiKey: process.env.RENDERDOC_API_KEY!,
     * });
     *
     * // Generate a PDF
     * const result = await renderdocs.documents.generate({
     *   templateId: 'tmpl_invoice',
     *   format: 'pdf',
     *   variables: { invoiceNumber: 'INV-001' },
     * });
     * ```
     */
    constructor(config: RenderDocsConfig);
    /**
     * Get the current authenticated user
     *
     * @example
     * ```typescript
     * const user = await renderdocs.me();
     * console.log('Authenticated as:', user.email);
     * ```
     */
    me(): Promise<User>;
    /**
     * Verify the API key is valid
     *
     * @example
     * ```typescript
     * const isValid = await renderdocs.verifyApiKey();
     * if (!isValid) {
     *   throw new Error('Invalid API key');
     * }
     * ```
     */
    verifyApiKey(): Promise<boolean>;
}
/**
 * Create a RenderDocs client
 *
 * @example
 * ```typescript
 * import { createClient } from '@renderdocs/sdk';
 *
 * const renderdocs = createClient({
 *   apiKey: process.env.RENDERDOC_API_KEY!,
 * });
 * ```
 */
declare function createClient(config: RenderDocsConfig): RenderDocs;

/**
 * Webhook Signature Verification Utilities
 */

interface VerifyWebhookOptions {
    /** Raw request body as string */
    payload: string;
    /** Signature from X-RenderDocs-Signature header */
    signature: string;
    /** Webhook secret from your subscription */
    secret: string;
    /** Timestamp tolerance in seconds (default: 300 = 5 minutes) */
    tolerance?: number;
}
interface ParsedWebhookSignature {
    timestamp: number;
    signature: string;
}
/**
 * Parse the webhook signature header
 */
declare function parseSignatureHeader(header: string): ParsedWebhookSignature;
/**
 * Compute the expected signature for a webhook payload
 */
declare function computeSignature(timestamp: number, payload: string, secret: string): string;
/**
 * Verify a webhook signature
 *
 * @example
 * ```typescript
 * import { verifyWebhookSignature } from '@renderdocs/sdk';
 *
 * app.post('/webhooks/renderdocs', (req, res) => {
 *   const signature = req.headers['x-renderdocs-signature'];
 *
 *   try {
 *     const event = verifyWebhookSignature({
 *       payload: req.body, // raw body string
 *       signature,
 *       secret: process.env.WEBHOOK_SECRET,
 *     });
 *
 *     // Process the verified event
 *     console.log('Received event:', event.type);
 *     res.status(200).send('OK');
 *   } catch (error) {
 *     console.error('Invalid signature:', error);
 *     res.status(400).send('Invalid signature');
 *   }
 * });
 * ```
 */
declare function verifyWebhookSignature(options: VerifyWebhookOptions): WebhookEvent;
declare class WebhookSignatureError extends Error {
    constructor(message: string);
}

export { type ApiError, type ApiResponse, type BatchDocument, type CreateWebhookOptions, type DocumentJob, type DocumentJobStatus, DocumentsResource, type GenerateBatchOptions, type GenerateBatchResponse, type GenerateDocumentOptions, type GenerateDocumentResponse, type ListDocumentJobsOptions, type ListTemplatesOptions, type PaginationMeta, RenderDocs, type RenderDocsConfig, RenderDocsError, type Template, type TemplateVariable, TemplatesResource, type User, type VerifyWebhookOptions, type WebhookEvent, type WebhookEventType, WebhookSignatureError, type WebhookSubscription, WebhooksResource, computeSignature, createClient, parseSignatureHeader, verifyWebhookSignature };
