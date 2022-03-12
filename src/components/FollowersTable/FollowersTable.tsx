import React from 'react';
import { Table, Typography, Tooltip, Space } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import type { FollowerInfo } from '_types';
import { IGImage } from '_components';

type FollowersTableProps = {
  data: FollowerInfo[];
};

const columns: ColumnsType<FollowerInfo> = [
  {
    dataIndex: 'profile_pic_url',
    render: (profile_pic_url, row) => (
      <Typography.Link
        href={`https://www.instagram.com/${row.username}/`}
        target="_blank"
      >
        <IGImage imgURL={profile_pic_url} />
      </Typography.Link>
    ),
  },
  {
    title: 'Username',
    dataIndex: 'username',
    sorter: (a, b) => a.username.localeCompare(b.username),
    render: (username, row) => (
      <Space>
        <Typography.Link
          href={`https://www.instagram.com/${username}/`}
          target="_blank"
        >
          {username}
        </Typography.Link>
        {row.is_business && (
          <Tooltip title="Business Account">
            <ShopOutlined />
          </Tooltip>
        )}
      </Space>
    ),
  },
  {
    title: 'Full Name',
    dataIndex: 'full_name',
    sorter: (a, b) => a.full_name.localeCompare(b.full_name),
  },
  {
    title: 'Follower Count',
    dataIndex: 'follower_count',
    defaultSortOrder: 'descend',
    sorter: (a, b) => (a.follower_count || 0) - (b.follower_count || 0),
  },
  {
    title: 'Following Count',
    dataIndex: 'following_count',
    sorter: (a, b) => (a.following_count || 0) - (b.following_count || 0),
  },
  {
    title: 'Media Count',
    dataIndex: 'media_count',
    sorter: (a, b) => (a.media_count || 0) - (b.media_count || 0),
  },
];

const FollowersTable: React.FC<FollowersTableProps> = ({ data }) => {
  return (
    <Table<FollowerInfo> columns={columns} dataSource={data} rowKey="id" />
  );
};

export default FollowersTable;
