import { Request, Response } from 'express';
import { FamilyService } from '../services/family.service';
import { handleError } from '../helpers/handle-error.helper';

const familyService = new FamilyService();

export default async function handler(req: Request, res: Response) {
  try {
    const { method } = req;
    const { action } = req.query;

    if (method === 'GET' && action === 'paged') {
      const { page = '1', pageSize = '10', search = '', sortBy, sortOrder = 'desc' } = req.query;

      const options = {
        page: parseInt(page as string) || 1,
        pageSize: parseInt(pageSize as string) || 10,
        search: search as string,
        sortBy: sortBy as string || 'id',
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await familyService.getFamiliesPaged(options);

      return res.status(200).json({
        success: true,
        ...result
      });
    }

    return res.status(405).json({
      error: 'Method not allowed or invalid action'
    });

  } catch (error) {
    console.error('Family API Error:', error);
    return handleError(res, error);
  }
}