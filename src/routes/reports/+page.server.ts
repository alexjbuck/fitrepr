import type { Actions } from './$types';
 
export const actions = {
  default: async ({cookies, request}) => {
    const data = await request.formData();
    const start = data.get('start');
    const end = data.get('end_date');
    return {start,end, success:true};
  }
} satisfies Actions;
