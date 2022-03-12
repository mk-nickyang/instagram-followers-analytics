import { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import useSWRImmutable from 'swr/immutable';
import queryString from 'query-string';
import { useRouter } from 'next/router';
import { Alert, Spin, PageHeader, Divider, Button, Input } from 'antd';
import { CSVLink } from 'react-csv';

import { FollowersTable } from '_components';
import { preset } from '_styles';
import type { FollowerInfo } from '_types';

const FollowersExplore: NextPage = () => {
  const [searchString, setSearchString] = useState<string>('');

  const router = useRouter();
  const { username } = router.query;

  const { data, error } = useSWRImmutable<FollowerInfo[]>(
    username ? `/api/followers?${queryString.stringify({ username })}` : null,
  );

  const filteredData: FollowerInfo[] | undefined = useMemo(() => {
    if (!searchString || !data) return data;

    return data.filter((follower) => {
      return (
        follower.username.toLowerCase().includes(searchString.toLowerCase()) ||
        follower.full_name.toLowerCase().includes(searchString.toLowerCase())
      );
    });
  }, [searchString, data]);

  if (!error && !data)
    return (
      <div
        css={{
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '.ant-spin-text': { marginTop: preset.spacing(1) },
        }}
      >
        <Spin size="large" tip="This can take a while..." />
      </div>
    );

  return (
    <>
      <PageHeader
        onBack={router.back}
        title={username}
        extra={
          filteredData?.length
            ? [
                <Button key="csv" type="primary">
                  <CSVLink
                    filename={`${username}-instagram-followers.csv`}
                    data={filteredData}
                  >
                    Export to CSV
                  </CSVLink>
                </Button>,
              ]
            : []
        }
      />

      <Divider css={{ margin: 0 }} />

      <main css={{ padding: preset.spacing(3) }}>
        {error && (
          <Alert
            message="There was an error fetching your followers"
            type="error"
            showIcon
            css={{ marginBottom: preset.spacing(5) }}
          />
        )}

        {filteredData && (
          <>
            <Input.Search
              placeholder="Enter username or full name"
              enterButton
              allowClear
              onSearch={setSearchString}
              css={{ marginBottom: preset.spacing(3), maxWidth: 480 }}
            />

            <FollowersTable data={filteredData} />
          </>
        )}
      </main>
    </>
  );
};

export default FollowersExplore;
