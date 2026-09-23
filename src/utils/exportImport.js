/**
 * JSON Export & Import utilities and Initial Demo Seed Data
 */

export const INITIAL_DEMO_GROUPS = [
  {
    id: 'grp-my-expenses',
    name: 'My Expenses',
    description: 'Shared group expenses',
    currency: 'INR',
    createdAt: Date.now(),
    members: [
      { id: 'mem-1', name: 'You', avatarColor: '#6C63FF' },
      { id: 'mem-2', name: 'Friend', avatarColor: '#38B2AC' },
    ],
    expenses: [],
    settlements: [],
  },
];


export function exportDataAsJSON(data, filename = 'fairshare-backup.json') {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Export failed:', err);
    return false;
  }
}

export function parseAndValidateImport(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    let groupsArray = [];

    if (Array.isArray(parsed)) {
      groupsArray = parsed;
    } else if (parsed && Array.isArray(parsed.groups)) {
      groupsArray = parsed.groups;
    } else if (parsed && parsed.id && parsed.name && Array.isArray(parsed.members)) {
      groupsArray = [parsed];
    } else {
      return { success: false, error: 'Invalid file structure. Expected an array of groups.' };
    }

    // Validate each group has required fields
    for (const g of groupsArray) {
      if (!g.id || !g.name || !Array.isArray(g.members)) {
        return { success: false, error: `Invalid group format found for group "${g.name || 'Unnamed'}"` };
      }
    }

    return { success: true, data: groupsArray };
  } catch (err) {
    return { success: false, error: `JSON parsing error: ${err.message}` };
  }
}
