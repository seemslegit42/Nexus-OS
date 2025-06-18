// src/lib/workers/data-processor.worker.ts
export interface DataProcessingTask {
  type:
    | 'FILTER_LARGE_DATASET'
    | 'COMPUTE_ANALYTICS'
    | 'TRANSFORM_DATA'
    | 'SEARCH_ITEMS';
  data: any;
  options?: Record<string, any>;
}

export interface DataProcessingResult {
  taskType: string;
  result: any;
  error?: string;
  processingTime: number;
}

// Heavy computation functions
function filterLargeDataset(
  data: any[],
  filterFn: string,
  options: any
): any[] {
  const startTime = performance.now();

  try {
    // Create filter function from string (for security, in real app use proper validation)
    const filter = new Function('item', 'options', `return ${filterFn}`);
    const filtered = data.filter(item => filter(item, options));

    return filtered;
  } catch (error) {
    throw new Error(`Filter error: ${error}`);
  }
}

function computeAnalytics(data: any[], analyticsType: string): any {
  const startTime = performance.now();

  switch (analyticsType) {
    case 'AGENT_PERFORMANCE':
      return {
        totalAgents: data.length,
        averageWorkload:
          data.reduce((sum, agent) => sum + (agent.workload || 0), 0) /
          data.length,
        highLoadAgents: data.filter(agent => agent.workload > 80).length,
        processingTime: performance.now() - startTime,
      };

    case 'LOG_ANALYSIS':
      const errorCount = data.filter(log => log.level === 'error').length;
      const warningCount = data.filter(log => log.level === 'warning').length;
      return {
        totalLogs: data.length,
        errorCount,
        warningCount,
        errorRate: errorCount / data.length,
        processingTime: performance.now() - startTime,
      };

    case 'USER_METRICS':
      return {
        totalUsers: data.length,
        activeUsers: data.filter(
          user =>
            user.lastActive &&
            Date.now() - new Date(user.lastActive).getTime() <
              7 * 24 * 60 * 60 * 1000
        ).length,
        averageSessionDuration:
          data.reduce((sum, user) => sum + (user.sessionDuration || 0), 0) /
          data.length,
        processingTime: performance.now() - startTime,
      };

    default:
      throw new Error(`Unknown analytics type: ${analyticsType}`);
  }
}

function transformData(
  data: any[],
  transformType: string,
  options: any
): any[] {
  switch (transformType) {
    case 'NORMALIZE':
      return data.map(item => ({
        ...item,
        normalized: true,
        processedAt: new Date().toISOString(),
      }));

    case 'AGGREGATE':
      const grouped = data.reduce((acc, item) => {
        const key = item[options.groupBy] || 'unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      return Object.entries(grouped).map(([key, items]) => ({
        group: key,
        count: (items as any[]).length,
        items: items,
      }));

    default:
      return data;
  }
}

function searchItems(
  data: any[],
  searchTerm: string,
  searchFields: string[]
): any[] {
  const lowerSearchTerm = searchTerm.toLowerCase();

  return data.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      return false;
    });
  });
}

// Main message handler
self.onmessage = function (e: MessageEvent<DataProcessingTask>) {
  const { type, data, options = {} } = e.data;
  const startTime = performance.now();

  try {
    let result: any;

    switch (type) {
      case 'FILTER_LARGE_DATASET':
        result = filterLargeDataset(data, options.filterFunction, options);
        break;

      case 'COMPUTE_ANALYTICS':
        result = computeAnalytics(data, options.analyticsType);
        break;

      case 'TRANSFORM_DATA':
        result = transformData(data, options.transformType, options);
        break;

      case 'SEARCH_ITEMS':
        result = searchItems(data, options.searchTerm, options.searchFields);
        break;

      default:
        throw new Error(`Unknown task type: ${type}`);
    }

    const processingTime = performance.now() - startTime;

    const response: DataProcessingResult = {
      taskType: type,
      result,
      processingTime,
    };

    self.postMessage(response);
  } catch (error) {
    const processingTime = performance.now() - startTime;

    const response: DataProcessingResult = {
      taskType: type,
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime,
    };

    self.postMessage(response);
  }
};

// Export types for TypeScript
export {};
