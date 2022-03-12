import type { NextPage } from 'next';
import { Typography, Input, Form } from 'antd';
import { useRouter } from 'next/router';

import { preset } from '_styles';

const Home: NextPage = () => {
  const router = useRouter();

  const onSearchClick = (searchValue: string) => {
    if (searchValue.trim()) {
      router.push(`/followers/${searchValue}`);
    }
  };

  return (
    <main
      css={{
        paddingTop: '30vh',
        paddingLeft: preset.spacing(3),
        paddingRight: preset.spacing(3),
        paddingBottom: preset.spacing(10),
      }}
    >
      <div
        css={{
          maxWidth: 640,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div css={{ textAlign: 'center', marginBottom: preset.spacing(3) }}>
          <Typography.Title level={1}>
            Find out your most-followed followers on Instagram
          </Typography.Title>
        </div>

        <Form
          css={{ '.ant-form-item-explain': { marginTop: preset.spacing(1) } }}
        >
          <Form.Item help="* Public Instagram account only">
            <Input.Search
              size="large"
              placeholder="Enter your Instagram username e.g. singsingtime"
              enterButton="Search"
              onSearch={onSearchClick}
            />
          </Form.Item>
        </Form>
      </div>
    </main>
  );
};

export default Home;
