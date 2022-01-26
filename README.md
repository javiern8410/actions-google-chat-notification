# Google Chat Notification for GitHub Actions

Sends a Google Chat notification.

![Success](images/success.png "Success")

## Usage
### Parameters
|Name|Required|Description|
|:---:|:---:|:---|
|name|true|Job name. Used for notification titles.|
|url|true|Google Chat Webhook URL.|
|status|true|Job status. Available values are `success`, `failure`, `cancelled`. We recommend using `${{ job.status }}` or `${{ steps..outcome/conclusion }}` |
|custom_text|false|Custom text to show in message. Supports HTML tags.|

### Examples
```yaml
- name: Google Chat Notification
  uses: colpal/actions-google-chat-notification@releases/v1
  with:
    name: Build
    url: ${{ secrets.GOOGLE_CHAT_WEBHOOK }}
    status: ${{ job.status }}
    custom_text: 'This happened because you are bad.'
  if: failure()
```