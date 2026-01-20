# @renderbase/sdk

Official Node.js SDK for Renderbase - the document generation platform with unified template design for PDF and Excel documents.

## Installation

```bash
npm install @renderbase/sdk
# or
yarn add @renderbase/sdk
# or
pnpm add @renderbase/sdk
```

## Quick Start

```typescript
import { Renderbase } from '@renderbase/sdk';

const renderbase = new Renderbase({
  apiKey: process.env.RENDERBASE_API_KEY!,
});

// Generate a PDF document (async - returns job info immediately)
const job = await renderbase.documents.generatePdf({
  templateId: 'tmpl_invoice',
  variables: {
    customerName: 'John Doe',
    invoiceNumber: 'INV-001',
    total: 150.00,
  },
});

console.log('Job ID:', job.jobId);
console.log('Status:', job.status);  // 'queued'

// Wait for completion to get the download URL
const completed = await renderbase.documents.waitForCompletion(job.jobId);
console.log('Download URL:', completed.downloadUrl);
```

## Features

- **Full TypeScript support** with comprehensive type definitions
- **Promise-based API** for modern async/await usage
- **PDF generation** - Generate PDF documents from templates
- **Excel generation** - Generate Excel documents from templates
- **Batch generation** - Generate multiple documents at once
- **Workspace support** - Generate documents in specific workspaces
- **Webhook verification** - Secure signature verification for webhooks
- **Polling utility** - Wait for document completion

## Usage Examples

### Generate PDF Document

```typescript
// Queue document generation
const job = await renderbase.documents.generatePdf({
  templateId: 'tmpl_invoice',
  variables: {
    invoiceNumber: 'INV-001',
    customerName: 'John Doe',
    items: [
      { description: 'Product A', quantity: 2, price: 50.00 },
      { description: 'Product B', quantity: 1, price: 50.00 },
    ],
    total: 150.00,
  },
});

// Wait for completion and get download URL
const completed = await renderbase.documents.waitForCompletion(job.jobId);
console.log('Download URL:', completed.downloadUrl);
```

### Generate Excel Document

```typescript
const job = await renderbase.documents.generateExcel({
  templateId: 'tmpl_report',
  variables: {
    reportMonth: 'January 2026',
    salesData: [
      { region: 'North', sales: 10000 },
      { region: 'South', sales: 15000 },
      { region: 'East', sales: 12000 },
    ],
  },
});

const completed = await renderbase.documents.waitForCompletion(job.jobId);
console.log('Download URL:', completed.downloadUrl);
```

### Generate Batch Documents

```typescript
// Queue batch generation - each object in documents array contains variables for one document
const batch = await renderbase.documents.generateBatch({
  templateId: 'tmpl_invoice',
  format: 'pdf',
  documents: [
    { invoiceNumber: 'INV-001', customerName: 'John Doe' },
    { invoiceNumber: 'INV-002', customerName: 'Jane Smith' },
    { invoiceNumber: 'INV-003', customerName: 'Bob Wilson' },
  ],
});

console.log('Batch ID:', batch.batchId);
console.log('Total jobs:', batch.totalJobs);
console.log('Estimated wait:', batch.estimatedWaitSeconds, 'seconds');
```

### Wait for Document Completion

```typescript
// Generate and wait for completion
const job = await renderbase.documents.generatePdf({
  templateId: 'tmpl_invoice',
  variables: { invoiceNumber: 'INV-001' },
});

const completed = await renderbase.documents.waitForCompletion(job.jobId, {
  pollInterval: 1000,  // Check every 1 second
  timeout: 30000,      // Wait up to 30 seconds
});

console.log('Download URL:', completed.downloadUrl);
```

### List Document Jobs

```typescript
// List recent jobs
const { data: jobs, meta } = await renderbase.documents.listJobs({
  limit: 20,
});

// Filter by status
const { data: completedJobs } = await renderbase.documents.listJobs({
  status: 'completed',
  format: 'pdf',
});

// Filter by workspace
const { data: workspaceJobs } = await renderbase.documents.listJobs({
  workspaceId: 'ws_abc123',
  dateFrom: new Date('2026-01-01'),
});

// Get specific job
const job = await renderbase.documents.getJob('job_abc123');
```

### Work with Templates

```typescript
// List all templates
const { data: templates } = await renderbase.templates.list();

// List by type
const { data: pdfTemplates } = await renderbase.templates.list({ type: 'pdf' });
const { data: excelTemplates } = await renderbase.templates.list({ type: 'excel' });

// Get template details
const template = await renderbase.templates.get('tmpl_abc123');
console.log('Variables:', template.variables);
```

### Manage Webhooks

```typescript
// Create a webhook subscription
const webhook = await renderbase.webhooks.create({
  url: 'https://your-app.com/webhooks/renderbase',
  events: ['document.completed', 'document.failed', 'batch.completed'],
  name: 'My Document Webhook',
});

// Save the secret for signature verification!
console.log('Webhook secret:', webhook.secret);

// List webhooks
const { data: webhooks } = await renderbase.webhooks.list();

// Delete a webhook
await renderbase.webhooks.delete('wh_abc123');
```

### Verify Webhook Signatures

```typescript
import { verifyWebhookSignature } from '@renderbase/sdk';

// Express.js example
app.post('/webhooks/renderbase', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-renderbase-signature'] as string;

  try {
    const event = verifyWebhookSignature({
      payload: req.body.toString(),
      signature,
      secret: process.env.WEBHOOK_SECRET!,
    });

    // Process the verified event
    switch (event.type) {
      case 'document.completed':
        console.log('Document ready:', event.data.downloadUrl);
        break;
      case 'document.failed':
        console.log('Document failed:', event.data.error);
        break;
      case 'batch.completed':
        console.log('Batch completed:', event.data.batchId);
        break;
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Invalid webhook signature:', error);
    res.status(400).send('Invalid signature');
  }
});
```

## Configuration

```typescript
const renderbase = new Renderbase({
  // Required: Your API key
  apiKey: process.env.RENDERBASE_API_KEY!,

  // Optional: Custom base URL (default: https://api.renderbase.dev)
  baseUrl: 'https://api.renderbase.dev',

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000,

  // Optional: Custom headers
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## Error Handling

```typescript
import { Renderbase, RenderbaseError } from '@renderbase/sdk';

try {
  await renderbase.documents.generatePdf({
    templateId: 'invalid_template',
  });
} catch (error) {
  if (error instanceof RenderbaseError) {
    console.error('API Error:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.statusCode);
  } else {
    throw error;
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and includes comprehensive type definitions:

```typescript
import type {
  GenerateDocumentOptions,
  GenerateDocumentResponse,
  DocumentJob,
  Template,
  WebhookEvent,
} from '@renderbase/sdk';

const options: GenerateDocumentOptions = {
  templateId: 'tmpl_123',
  format: 'pdf',
  variables: { name: 'John' },
  workspaceId: 'ws_abc123',  // Optional
};

const result: GenerateDocumentResponse = await renderbase.documents.generate(options);
```

## API Reference

### Client Methods

- `renderbase.me()` - Get current authenticated user
- `renderbase.verifyApiKey()` - Verify API key is valid

### Documents Resource

- `renderbase.documents.generate(options)` - Generate a document (PDF or Excel)
- `renderbase.documents.generatePdf(options)` - Generate a PDF document
- `renderbase.documents.generateExcel(options)` - Generate an Excel document
- `renderbase.documents.generateBatch(options)` - Generate batch documents
- `renderbase.documents.getJob(id)` - Get document job by ID
- `renderbase.documents.listJobs(options)` - List/search document jobs
- `renderbase.documents.waitForCompletion(id, options)` - Wait for job completion

### Templates Resource

- `renderbase.templates.get(id)` - Get template by ID
- `renderbase.templates.list(options)` - List templates

### Webhooks Resource

- `renderbase.webhooks.create(options)` - Create webhook subscription
- `renderbase.webhooks.get(id)` - Get webhook by ID
- `renderbase.webhooks.list()` - List webhooks
- `renderbase.webhooks.update(id, options)` - Update webhook
- `renderbase.webhooks.delete(id)` - Delete webhook

### Utilities

- `verifyWebhookSignature(options)` - Verify webhook signature
- `parseSignatureHeader(header)` - Parse signature header
- `computeSignature(timestamp, payload, secret)` - Compute signature

## Requirements

- Node.js 18.0.0 or higher

## License

MIT

## Support

- Documentation: https://docs.renderbase.dev/sdk/node
- API Reference: https://docs.renderbase.dev/api
- Support: support@renderbase.dev
