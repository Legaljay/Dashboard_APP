import { useState, useEffect, useMemo } from 'react';
import { diff, Diff, DiffNew, DiffDeleted, DiffEdit, DiffArray } from 'deep-diff';

// Enum for change categories
export enum ChangeCategory {
  APPLICATION = 'application',
  MEMORY = 'memory',
  INSTRUCTIONS = 'instructions',
  PLUGINS = 'plugins'
}

// Enum for change types
export enum ChangeType {
  ADDED = 'added',
  REMOVED = 'removed',
  UPDATED = 'updated',
  ARRAY_CHANGED = 'array_changed'
}

// Detailed change interface
export interface DetailedChange {
  path: string[];
  type: ChangeType;
  oldValue?: any;
  newValue?: any;
}

// Change summary interface
interface ChangeSummary {
  category: ChangeCategory;
  totalChanges: number;
  detailedChanges: DetailedChange[];
}

// Transform deep-diff output to our DetailedChange format
function transformDiff(difference: Diff<any, any>): DetailedChange {
  const path = difference.path || [];
  
  switch (difference.kind) {
    case 'N': { // New
      const newDiff = difference as DiffNew<any>;
      return {
        path,
        type: ChangeType.ADDED,
        newValue: newDiff.rhs
      };
    }
    case 'D': { // Deleted
      const deletedDiff = difference as DiffDeleted<any>;
      return {
        path,
        type: ChangeType.REMOVED,
        oldValue: deletedDiff.lhs
      };
    }
    case 'E': { // Edited
      const editDiff = difference as DiffEdit<any>;
      return {
        path,
        type: ChangeType.UPDATED,
        oldValue: editDiff.lhs,
        newValue: editDiff.rhs
      };
    }
    case 'A': { // Array
      const arrayDiff = difference as DiffArray<any>;
      const arrayChange = transformDiff(arrayDiff.item);
      return {
        path: [...path, arrayDiff.index.toString()],
        type: ChangeType.ARRAY_CHANGED,
        oldValue: arrayChange.oldValue,
        newValue: arrayChange.newValue
      };
    }
    default:
      throw new Error(`Unknown diff kind: ${(difference as any).kind}`);
  }
}

// // Change detection hook
// export default function useChangeDetector(
//   currentData: Record<ChangeCategory, any>,
//   previousData: Record<ChangeCategory, any>
// ) {
//   const [changes, setChanges] = useState<ChangeSummary[]>([]);

//   useEffect(() => {
//     const detectedChanges: ChangeSummary[] = Object.values(ChangeCategory)
//       .map(category => {
//         const differences = diff(
//           previousData[category] || {}, 
//           currentData[category] || {}
//         );

//         const detailedChanges: DetailedChange[] = differences 
//           ? differences.map(transformDiff)
//           : [];

//         return {
//           category,
//           totalChanges: detailedChanges.length,
//           detailedChanges
//         };
//       })
//       .filter(summary => summary.totalChanges > 0);

//     setChanges(detectedChanges);
//   }, [currentData, previousData]);

//   return changes;
// }

// //tracks every changes in the object
// function getPropertyDiffs(oldObj: any, newObj: any, path: string[] = []): DetailedChange[] {
//     const changes: DetailedChange[] = [];
    
//     // Handle different types of values
//     if (typeof oldObj !== typeof newObj) {
//       changes.push({
//         path,
//         type: ChangeType.UPDATED,
//         oldValue: oldObj,
//         newValue: newObj
//       });
//       return changes;
//     }
  
//     if (Array.isArray(oldObj) && Array.isArray(newObj)) {
//       // Handle arrays
//       const maxLength = Math.max(oldObj.length, newObj.length);
//       for (let i = 0; i < maxLength; i++) {
//         if (i >= oldObj.length) {
//           changes.push({
//             path: [...path, i.toString()],
//             type: ChangeType.ADDED,
//             newValue: newObj[i]
//           });
//         } else if (i >= newObj.length) {
//           changes.push({
//             path: [...path, i.toString()],
//             type: ChangeType.REMOVED,
//             oldValue: oldObj[i]
//           });
//         } else if (JSON.stringify(oldObj[i]) !== JSON.stringify(newObj[i])) {
//           changes.push(...getPropertyDiffs(oldObj[i], newObj[i], [...path, i.toString()]));
//         }
//       }
//     } else if (typeof oldObj === 'object' && oldObj !== null && typeof newObj === 'object' && newObj !== null) {
//       // Handle objects
//       const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
      
//       for (const key of allKeys) {
//         if (!(key in oldObj)) {
//           changes.push({
//             path: [...path, key],
//             type: ChangeType.ADDED,
//             newValue: newObj[key]
//           });
//         } else if (!(key in newObj)) {
//           changes.push({
//             path: [...path, key],
//             type: ChangeType.REMOVED,
//             oldValue: oldObj[key]
//           });
//         } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
//           changes.push(...getPropertyDiffs(oldObj[key], newObj[key], [...path, key]));
//         }
//       }
//     } else if (oldObj !== newObj) {
//       changes.push({
//         path,
//         type: ChangeType.UPDATED,
//         oldValue: oldObj,
//         newValue: newObj
//       });
//     }
    
//     return changes;
//   }

// const APPLICATION_TRACKED_KEYS = [
//     "icon_url",
//     "app_key", 
//     "type",
//     "name",
//     "deactivated",
//     "is_deleted", 
//     "sale_agent_name",
//     "switch_app_type",
//     "description",
//     "personality_type",
//     "is_light",
//     "verbose"
//   ];
  
//   function getPropertyDiffs(oldObj: any, newObj: any, path: string[] = [], category?: ChangeCategory): DetailedChange[] {
//     const changes: DetailedChange[] = [];
    
//     // For application category, only check specific keys
//     if (category === ChangeCategory.APPLICATION) {
//       const objToCheck = Array.isArray(oldObj) ? oldObj[0] : oldObj;
//       const newObjToCheck = Array.isArray(newObj) ? newObj[0] : newObj;
      
//       if (!objToCheck || !newObjToCheck) return changes;
  
//       for (const key of APPLICATION_TRACKED_KEYS) {
//         if (objToCheck[key] !== newObjToCheck[key]) {
//           changes.push({
//             path: [...path, key],
//             type: objToCheck[key] === undefined ? ChangeType.ADDED : 
//                   newObjToCheck[key] === undefined ? ChangeType.REMOVED : 
//                   ChangeType.UPDATED,
//             oldValue: objToCheck[key],
//             newValue: newObjToCheck[key]
//           });
//         }
//       }
//       return changes;
//     }
  
//     // For other categories, keep existing logic
//     if (typeof oldObj !== typeof newObj) {
//       changes.push({
//         path,
//         type: ChangeType.UPDATED,
//         oldValue: oldObj,
//         newValue: newObj
//       });
//       return changes;
//     }
  
//     if (Array.isArray(oldObj) && Array.isArray(newObj)) {
//       const maxLength = Math.max(oldObj.length, newObj.length);
//       for (let i = 0; i < maxLength; i++) {
//         if (i >= oldObj.length) {
//           changes.push({
//             path: [...path, i.toString()],
//             type: ChangeType.ADDED,
//             newValue: newObj[i]
//           });
//         } else if (i >= newObj.length) {
//           changes.push({
//             path: [...path, i.toString()],
//             type: ChangeType.REMOVED,
//             oldValue: oldObj[i]
//           });
//         } else if (JSON.stringify(oldObj[i]) !== JSON.stringify(newObj[i])) {
//           changes.push(...getPropertyDiffs(oldObj[i], newObj[i], [...path, i.toString()], category));
//         }
//       }
//     } else if (typeof oldObj === 'object' && oldObj !== null && typeof newObj === 'object' && newObj !== null) {
//       const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
      
//       for (const key of allKeys) {
//         if (!(key in oldObj)) {
//           changes.push({
//             path: [...path, key],
//             type: ChangeType.ADDED,
//             newValue: newObj[key]
//           });
//         } else if (!(key in newObj)) {
//           changes.push({
//             path: [...path, key],
//             type: ChangeType.REMOVED,
//             oldValue: oldObj[key]
//           });
//         } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
//           changes.push(...getPropertyDiffs(oldObj[key], newObj[key], [...path, key], category));
//         }
//       }
//     } else if (oldObj !== newObj) {
//       changes.push({
//         path,
//         type: ChangeType.UPDATED,
//         oldValue: oldObj,
//         newValue: newObj
//       });
//     }
    
//     return changes;
//   }
  
//   export default function useChangeDetector(
//     currentData: Record<ChangeCategory, any>,
//     previousData: Record<ChangeCategory, any>
//   ) {
//     const [changes, setChanges] = useState<ChangeSummary[]>([]);
  
//     useEffect(() => {
//       const detectedChanges: ChangeSummary[] = Object.values(ChangeCategory)
//         .map(category => {
//           const detailedChanges = getPropertyDiffs(
//             previousData[category] || {},
//             currentData[category] || {},
//             [category]
//           );
  
//           return {
//             category,
//             totalChanges: detailedChanges.length,
//             detailedChanges
//           };
//         })
//         .filter(summary => summary.totalChanges > 0);
  
//       setChanges(detectedChanges);
//     }, [currentData, previousData, changes]);
  
//     return changes;
//   }


const APPLICATION_TRACKED_KEYS = [
    "icon_url",
    "app_key", 
    "type",
    "name",
    "deactivated",
    "is_deleted", 
    "sale_agent_name",
    "switch_app_type",
    "description",
    "personality_type",
    "is_light",
    "verbose"
  ] as const;
  
  function getPropertyDiffs(oldObj: any, newObj: any, path: string[] = [], category?: ChangeCategory): DetailedChange[] {
    const changes: DetailedChange[] = [];
    
    if (category === ChangeCategory.APPLICATION) {
      const objToCheck = Array.isArray(oldObj) ? oldObj[0] : oldObj;
      const newObjToCheck = Array.isArray(newObj) ? newObj[0] : newObj;
      
      if (!objToCheck || !newObjToCheck) return changes;
  
      for (const key of APPLICATION_TRACKED_KEYS) {
        // Using strict equality check
        if (objToCheck[key] !== newObjToCheck[key]) {
          changes.push({
            path: [...path, key],
            type: objToCheck[key] === undefined ? ChangeType.ADDED : 
                  newObjToCheck[key] === undefined ? ChangeType.REMOVED : 
                  ChangeType.UPDATED,
            oldValue: objToCheck[key],
            newValue: newObjToCheck[key]
          });
        }
      }
      return changes;
    }
  
    // For other categories, we simplify the comparison
    if (!oldObj || !newObj || typeof oldObj !== typeof newObj) {
      return [{
        path,
        type: ChangeType.UPDATED,
        oldValue: oldObj,
        newValue: newObj
      }];
    }
  
    if (Array.isArray(oldObj)) {
      if (oldObj.length === 0 && newObj.length === 0) return [];
      
      return [{
        path,
        type: ChangeType.UPDATED,
        oldValue: oldObj,
        newValue: newObj
      }];
    }
  
    if (typeof oldObj === 'object') {
      const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
      
      for (const key of allKeys) {
        const oldValue = oldObj[key];
        const newValue = newObj[key];
        
        if (oldValue !== newValue) {
          changes.push({
            path: [...path, key],
            type: !(key in oldObj) ? ChangeType.ADDED :
                  !(key in newObj) ? ChangeType.REMOVED :
                  ChangeType.UPDATED,
            oldValue,
            newValue
          });
        }
      }
    }
    
    return changes;
  }
  
  export default function useChangeDetector(
    currentData: Record<ChangeCategory, any>,
    previousData: Record<ChangeCategory, any>
  ) {
    const [changes, setChanges] = useState<ChangeSummary[]>([]);
  
    // Memoize the inputs to prevent unnecessary recalculations
    const memoizedCurrent = useMemo(() => currentData, [JSON.stringify(currentData)]);
    const memoizedPrevious = useMemo(() => previousData, [JSON.stringify(previousData)]);
  
    useEffect(() => {
      // Memoize the change detection function
      const detectChanges = () => {
        const detectedChanges: ChangeSummary[] = Object.values(ChangeCategory)
          .map(category => {
            const detailedChanges = getPropertyDiffs(
              memoizedPrevious[category],
              memoizedCurrent[category],
              [category],
              category
            );
  
            return {
              category,
              totalChanges: detailedChanges.length,
              detailedChanges
            };
          })
          .filter(summary => summary.totalChanges > 0);
  
        return detectedChanges;
      };
  
      // Only update state if changes are different
      const newChanges = detectChanges();
      if (JSON.stringify(changes) !== JSON.stringify(newChanges)) {
        setChanges(newChanges);
      }
    }, [memoizedCurrent, memoizedPrevious]); // Only depend on memoized values
  
    return changes;
  }