export function getExpoDomainUrl(): string {
  if (process.env.EXPO_STAGING) {
    return `https://staging.expo.io`;
  } else if (process.env.EXPO_LOCAL) {
    return `http://expo.test`;
  } else {
    return `https://expo.io`;
  }
}

export function constructBuildLogsUrl({
  buildId,
  username,
  v2 = false,
}: {
  buildId: string;
  username?: string;
  v2?: boolean;
}): string {
  if (v2) {
    return `${getExpoDomainUrl()}/dashboard/${username}/builds/v2/${buildId}`;
  } else if (username) {
    return `${getExpoDomainUrl()}/dashboard/${username}/builds/${buildId}`;
  } else {
    return `${getExpoDomainUrl()}/builds/${buildId}`;
  }
}

export function constructTurtleStatusUrl(): string {
  return `${getExpoDomainUrl()}/turtle-status`;
}

export function constructArtifactUrl(artifactId: string): string {
  return `${getExpoDomainUrl()}/artifacts/${artifactId}`;
}
