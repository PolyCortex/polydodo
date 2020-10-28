import { Octokit } from '@octokit/rest';
import { detect } from 'detect-browser';

const octokit = new Octokit();

const getPublishedReleases = async () => {
  const releases = await octokit.repos.listReleases({ owner: 'polycortex', repo: 'polydodo' });
  const publishedReleases = releases.data.filter((release) => !release.draft);
  return publishedReleases;
};

const assetDisplayNameMap = {
  'server-linux': 'Linux',
  'server-macos': 'Mac OS',
  'server-windows.exe': 'Windows',
};

const currentOsName = detect().os;

export const getLatestServerReleaseAssets = async () => {
  const latestRelease = (await getPublishedReleases())[0];
  return latestRelease.assets
    .filter((asset) => asset.name.startsWith('server'))
    .map((asset) => ({
      name: assetDisplayNameMap[asset.name],
      currentOs: currentOsName.includes(assetDisplayNameMap[asset.name]),
      url: asset.browser_download_url,
    }));
};
