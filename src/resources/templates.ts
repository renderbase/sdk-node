/**
 * Templates Resource
 */

import type { HttpClient } from '../utils/http';
import type {
  ApiResponse,
  Template,
  ListTemplatesOptions,
  PaginationMeta,
} from '../types';

export class TemplatesResource {
  constructor(private http: HttpClient) {}

  /**
   * Get a template by ID
   *
   * @example
   * ```typescript
   * const template = await renderbase.templates.get('tmpl_abc123');
   * console.log('Template:', template.name);
   * console.log('Variables:', template.variables);
   * ```
   */
  async get(id: string): Promise<Template> {
    const response = await this.http.get<ApiResponse<Template>>(
      `/api/v1/templates/${id}`
    );
    return response.data;
  }

  /**
   * List templates with optional filters
   *
   * @example
   * ```typescript
   * // List all PDF templates
   * const { data } = await renderbase.templates.list({ type: 'pdf' });
   *
   * // List all Excel templates
   * const { data: excelTemplates } = await renderbase.templates.list({ type: 'excel' });
   * ```
   */
  async list(
    options: ListTemplatesOptions = {}
  ): Promise<{ data: Template[]; meta: PaginationMeta }> {
    const response = await this.http.get<ApiResponse<Template[]>>(
      '/api/v1/templates',
      {
        type: options.type,
        limit: options.limit,
        page: options.page,
      }
    );

    return {
      data: response.data,
      meta: response.meta!,
    };
  }

  /**
   * List only PDF templates
   *
   * @example
   * ```typescript
   * const { data } = await renderbase.templates.listPdf();
   * ```
   */
  async listPdf(
    options: Omit<ListTemplatesOptions, 'type'> = {}
  ): Promise<{ data: Template[]; meta: PaginationMeta }> {
    return this.list({ ...options, type: 'pdf' });
  }

  /**
   * List only Excel templates
   *
   * @example
   * ```typescript
   * const { data } = await renderbase.templates.listExcel();
   * ```
   */
  async listExcel(
    options: Omit<ListTemplatesOptions, 'type'> = {}
  ): Promise<{ data: Template[]; meta: PaginationMeta }> {
    return this.list({ ...options, type: 'excel' });
  }
}
