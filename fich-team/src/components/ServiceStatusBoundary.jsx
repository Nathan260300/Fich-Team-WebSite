import { Fragment, useSyncExternalStore } from 'react';
import { getServiceStatus, subscribeServiceStatus } from '../lib/serviceStatus';
import ServiceUnavailable from '../pages/ServiceUnavailable';

export default function ServiceStatusBoundary({ children }) {
  const { failure, generation } = useSyncExternalStore(subscribeServiceStatus, getServiceStatus);

  if (failure) return <ServiceUnavailable />;

  return <Fragment key={generation}>{children}</Fragment>;
}
