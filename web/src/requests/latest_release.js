import { Octokit } from '@octokit/rest';
import { detect } from 'detect-browser';

const octokit = new Octokit();

const CURRENT_OS_NAME = detect().os;

const ASSET_DISPLAYNAME_MAP = {
  'polydodo_server_standalone_linux-x64.tar.gz': 'Linux',
  'polydodo_server_standalone_macos-x64.tar.gz': 'Mac OS',
  'polydodo_server_standalone_windows-x64.exe': 'Windows',
};

const getPublishedReleases = async () => {
  const releases = await octokit.repos.listReleases({ owner: 'polycortex', repo: 'polydodo' });
  const publishedReleases = releases.data.filter((release) => !release.draft);
  return publishedReleases;
};

export const getLatestServerReleaseAssets = async () => {
  const latestRelease = (await getPublishedReleases())[0];
  return latestRelease.assets
    .filter((asset) => asset.name.startsWith('polydodo_server'))
    .map((asset) => ({
      name: ASSET_DISPLAYNAME_MAP[asset.name],
      currentOs: CURRENT_OS_NAME.includes(ASSET_DISPLAYNAME_MAP[asset.name]),
      url: asset.browser_download_url,
    }));
};
