
-- USERS
{
  "event": "file.uploaded",
  "fileId": "uuid",
  "userId": "uuid",
  "url": "string",
  "timestamp": "ISO8601"
}

--GROUPS
groups (
  id UUID PK,
  name VARCHAR,
  admin_id UUID FK -> users.id,
  created_at TIMESTAMP
)

--GROUP_MEMBERS
group_members (
  user_id UUID FK -> users.id,
  group_id UUID FK -> groups.id,
  role VARCHAR, -- admin / member
  joined_at TIMESTAMP,
  PRIMARY KEY (user_id, group_id)
)

--MESSAGES
messages (
  id UUID PK,
  group_id UUID FK -> groups.id,
  sender_id UUID FK -> users.id,
  content TEXT,
  type VARCHAR, -- text / image / file
  created_at TIMESTAMP
)

--MESSAGE_STATUS
message_status (
  message_id UUID FK -> messages.id,
  user_id UUID FK -> users.id,
  status VARCHAR, -- sent / delivered / read
  updated_at TIMESTAMP,
  PRIMARY KEY (message_id, user_id)
)

--MEDIA
media (
  id UUID PK,
  message_id UUID FK -> messages.id,
  url TEXT,
  type VARCHAR,
  created_at TIMESTAMP
)