import { getBoundaryStatus } from './getBoundaryStatus';

export function contextBoundary() {
  return getBoundaryStatus('contextBoundary');
}
