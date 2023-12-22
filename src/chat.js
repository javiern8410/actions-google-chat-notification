const github = require('@actions/github');

const axios = require('axios');

const statusColorPalette = (status) => {
  switch (status) {
    case 'success':
      return '#13d13f';
    case 'failure':
      return '#ff0000';
    case 'cancelled':
      return '#ffcd07';
    default:
      throw Error(`Invalid parameter. status=${status}.`);
  }
};

const statusText = (status) => {
  switch (status) {
    case 'success':
      return 'Success';
    case 'failure':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    default:
      throw Error(`Invalid parameter. status=${status}.`);
  }
};

const textButton = (text, url) => ({
  textButton: {
    text,
    onClick: { openLink: { url } },
  },
});

const notify = async (name, url, status, customText) => {
  const { owner, repo } = github.context.repo;
  const {
    eventName, sha, ref, actor,
  } = github.context;
  const actorAvatar = github.context?.payload?.sender?.avatar_url;
  const { number } = github.context.issue;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const branch = ref.split('/').pop();
  const refUrl = `${repoUrl}/tree/${branch}`;
  const eventPath = eventName === 'pull_request' ? `/pull/${number}` : `/commit/${sha}`;
  const eventUrl = `${repoUrl}${eventPath}`;
  const checksUrl = `${repoUrl}${eventPath}/checks`;
  const profileUrl = `https://github.com/${actor}`;

  const customMessage = customText ? `Message:\n${customText}` : '';

  const body = {
    cards: [
      {
        sections: [
          {
            widgets: [
              {
                textParagraph: {
                  text: `<b>${name} <font color="${statusColorPalette(
                    status,
                  )}">${statusText(status)}</font></b>`,
                },
              },
            ],
          },
          {
            widgets: [
              {
                keyValue: {
                  content: actor,
                  iconUrl: actorAvatar,
                  onClick: {
                    openLink: {
                      url: profileUrl,
                    },
                  },
                },
              },
              {
                keyValue: {
                  topLabel: 'Repository:',
                  content: `${owner}/${repo}`,
                  contentMultiline: true,
                  onClick: {
                    openLink: {
                      url: repoUrl,
                    },
                  },
                },
              },
              {
                keyValue: {
                  topLabel: 'Event:',
                  content: eventName,
                  onClick: {
                    openLink: {
                      url: eventUrl,
                    },
                  },
                },
              },
              {
                keyValue: {
                  topLabel: 'Branch:',
                  content: branch,
                  onClick: {
                    openLink: {
                      url: refUrl,
                    },
                  },
                },
              },
            ],
          },
          {
            widgets: [
              {
                textParagraph: { text: customMessage },
              },
              {
                buttons: [textButton('OPEN CHECKS', checksUrl)],
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await axios.default.post(url, body);
  if (response.status !== 200) {
    throw new Error(
      `Google Chat notification failed. response status=${response.status}\nResponse message=${response.data}`,
    );
  }
};

module.exports = { notify };
