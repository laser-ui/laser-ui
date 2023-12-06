import { Icon, Tabs, Tooltip } from '@laser-ui/components';
import { useMount } from '@laser-ui/hooks';
import { classNames, copy } from '@laser-ui/utils';
import CheckOutlined from '@material-design-icons/svg/outlined/check.svg?react';
import ContentCopyOutlined from '@material-design-icons/svg/outlined/content_copy.svg?react';
import { isArray } from 'lodash';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { openCodeSandbox, openStackBlitz } from './online-ide';
import marked from '../marked';
import { decode } from '../utils';

interface DemoBoxProps {
  id: string;
  renderer: React.ReactNode;
  title: string;
  description: number[];
  tsxSource: number[];
  scssSource?: number[];
}

export function DemoBox(props: DemoBoxProps): JSX.Element | null {
  const { id, renderer, title, description: descriptionProp, tsxSource: tsxSourceProp, scssSource: scssSourceProp } = props;

  const description = marked(decode(descriptionProp));
  const tsxSource = decode(tsxSourceProp);
  const scssSource = scssSourceProp ? decode(scssSourceProp) : undefined;

  const { t } = useTranslation();

  const elRef = useRef<HTMLElement>(null);

  const tsx = marked(String.raw`
${'```tsx'}
${tsxSource}
${'```'}
`);
  const scss = scssSource
    ? marked(String.raw`
${'```scss'}
${scssSource}
${'```'}
`)
    : undefined;

  const [tab, setTab] = useState<string>('tsx');

  const [openCode, setOpencode] = useState(false);
  const [copyCode, setCopycode] = useState(false);

  const location = useLocation();
  const active = location.hash === `#${id}`;

  const handleOpenClick = () => {
    setOpencode((draft) => !draft);
  };

  const handleCopyClick = () => {
    copy(tab === 'tsx' ? tsxSource : (scssSource as string));
    setCopycode(true);
  };

  const afterCopyTrige = (visible: boolean) => {
    if (!visible) {
      setCopycode(false);
    }
  };

  useMount(() => {
    if (window.location.hash === `#${id}` && elRef.current) {
      elRef.current.scrollIntoView();
    }
  });

  return (
    <section
      ref={elRef}
      id={id}
      className={classNames('app-demo-box', {
        'is-active': active,
      })}
    >
      <div className="app-demo-box__renderer">
        {isArray(renderer) ? (
          <div className="app-demo-box__window">
            <div className="app-demo-box__window-header">
              <div />
              <div />
              <div />
              <div />
            </div>
            <iframe src={renderer[0]} title="demo" height={renderer[1]} />
          </div>
        ) : (
          renderer
        )}
      </div>
      <div className="app-demo-box__title">
        <div className="app-demo-box__title-divider" style={{ width: 20 }} />
        <div className="app-demo-box__title-text">{title.replace('#', '')}</div>
        <div className="app-demo-box__title-divider" style={{ flexGrow: 1 }} />
      </div>
      <div className="app-demo-box__description" dangerouslySetInnerHTML={{ __html: description }} />
      <div className="app-demo-box__toolbar">
        <Tooltip title={t('Open in CodeSandbox')}>
          <Icon
            className="app-demo-box__button"
            size={18}
            onClick={() => {
              openCodeSandbox(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                `${document.getElementById('component-route-title')!.textContent!.match(/[a-zA-Z]+/)![0]}`,
                tsxSource,
                scssSource,
              );
            }}
          >
            <svg viewBox="64 64 896 896" xmlns="http://www.w3.org/2000/svg">
              <path d="M709.6 210l.4-.2h.2L512 96 313.9 209.8h-.2l.7.3L151.5 304v416L512 928l360.5-208V304l-162.9-94zM482.7 843.6L339.6 761V621.4L210 547.8V372.9l272.7 157.3v313.4zM238.2 321.5l134.7-77.8 138.9 79.7 139.1-79.9 135.2 78-273.9 158-274-158zM814 548.3l-128.8 73.1v139.1l-143.9 83V530.4L814 373.1v175.2z" />
            </svg>
          </Icon>
        </Tooltip>
        <Tooltip title={t('Open in Stackblitz')}>
          <Icon
            className="app-demo-box__button"
            size={18}
            onClick={() => {
              openStackBlitz(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                `${document.getElementById('component-route-title')!.textContent!.match(/[a-zA-Z]+/)![0]}`,
                tsxSource,
                scssSource,
              );
            }}
          >
            <svg viewBox="64 64 896 896" xmlns="http://www.w3.org/2000/svg">
              <path d="M848 359.3H627.7L825.8 109c4.1-5.3.4-13-6.3-13H436c-2.8 0-5.5 1.5-6.9 4L170 547.5c-3.1 5.3.7 12 6.9 12h174.4l-89.4 357.6c-1.9 7.8 7.5 13.3 13.3 7.7L853.5 373c5.2-4.9 1.7-13.7-5.5-13.7zM378.2 732.5l60.3-241H281.1l189.6-327.4h224.6L487 427.4h211L378.2 732.5z" />
            </svg>
          </Icon>
        </Tooltip>
        <Tooltip title={copyCode ? t('Copied!') : t('Copy code')} afterVisibleChange={afterCopyTrige}>
          <div className="app-demo-box__button" onClick={handleCopyClick}>
            {copyCode ? (
              <Icon size={18} theme="success">
                <CheckOutlined />
              </Icon>
            ) : (
              <Icon size={18}>
                <ContentCopyOutlined />
              </Icon>
            )}
          </div>
        </Tooltip>
        <Tooltip title={openCode ? t('Hide code') : t('Show code')}>
          <Icon className="app-demo-box__button" size={18} onClick={handleOpenClick}>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              {openCode ? (
                <path d="M1018.645 531.298c8.635-18.61 4.601-41.42-11.442-55.864l-205.108-184.68c-19.7-17.739-50.05-16.148-67.789 3.552-17.738 19.7-16.148 50.051 3.553 67.79l166.28 149.718-167.28 150.62c-19.7 17.738-21.291 48.088-3.553 67.789 17.739 19.7 48.089 21.291 67.79 3.553l205.107-184.68a47.805 47.805 0 0 0 12.442-17.798zM119.947 511.39l166.28-149.719c19.7-17.738 21.29-48.088 3.552-67.789-17.738-19.7-48.088-21.291-67.789-3.553L16.882 475.01C.84 489.456-3.194 512.264 5.44 530.874a47.805 47.805 0 0 0 12.442 17.798l205.108 184.68c19.7 17.739 50.05 16.148 67.79-3.552 17.738-19.7 16.147-50.051-3.553-67.79l-167.28-150.62zm529.545-377.146c24.911 9.066 37.755 36.61 28.688 61.522L436.03 861.068c-9.067 24.911-36.611 37.755-61.522 28.688-24.911-9.066-37.755-36.61-28.688-61.522l242.15-665.302c9.067-24.911 36.611-37.755 61.522-28.688z" />
              ) : (
                <path d="M1018.645 531.298c8.635-18.61 4.601-41.42-11.442-55.864l-205.108-184.68c-19.7-17.739-50.05-16.148-67.789 3.552-17.738 19.7-16.148 50.051 3.553 67.79l166.28 149.718-167.28 150.62c-19.7 17.738-21.291 48.088-3.553 67.789 17.739 19.7 48.089 21.291 67.79 3.553l205.107-184.68a47.805 47.805 0 0 0 12.442-17.798zM119.947 511.39l166.28-149.719c19.7-17.738 21.29-48.088 3.552-67.789-17.738-19.7-48.088-21.291-67.789-3.553L16.882 475.01C.84 489.456-3.194 512.264 5.44 530.874a47.805 47.805 0 0 0 12.442 17.798l205.108 184.68c19.7 17.739 50.05 16.148 67.79-3.552 17.738-19.7 16.147-50.051-3.553-67.79l-167.28-150.62z" />
              )}
            </svg>
          </Icon>
        </Tooltip>
      </div>
      {openCode && (
        <div className="app-demo-box__code">
          {!scss && <div dangerouslySetInnerHTML={{ __html: tsx }} />}
          {scss && (
            <Tabs
              styleOverrides={{ tabs__tabpanel: { style: { margin: 0 } } }}
              list={['tsx', 'scss'].map((code) => ({
                id: code,
                title: code,
                panel: <div dangerouslySetInnerHTML={{ __html: code === 'tsx' ? tsx : scss }} />,
              }))}
              active={tab}
              size="small"
              center
              onActiveChange={(id) => {
                setTab(id);
              }}
            />
          )}
        </div>
      )}
    </section>
  );
}
