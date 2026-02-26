import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { useLanguage } from '@/lib/i18n';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">{t('privacy.title')}</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.intro.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                {t('privacy.intro.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.collect.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="mb-3">{t('privacy.collect.intro')}</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>{t('privacy.collect.usage')}</strong> {t('privacy.collect.usageDesc')}
                </li>
                <li>
                  <strong>{t('privacy.collect.cookies')}</strong> {t('privacy.collect.cookiesDesc')}
                </li>
                <li>
                  <strong>{t('privacy.collect.contact')}</strong> {t('privacy.collect.contactDesc')}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.purpose.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="mb-3">{t('privacy.purpose.intro')}</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>{t('privacy.purpose.functional')}</strong> {t('privacy.purpose.functionalDesc')}
                </li>
                <li>
                  <strong>{t('privacy.purpose.analytics')}</strong> {t('privacy.purpose.analyticsDesc')}
                </li>
                <li>
                  <strong>{t('privacy.purpose.service')}</strong> {t('privacy.purpose.serviceDesc')}
                </li>
                <li>
                  <strong>{t('privacy.purpose.communication')}</strong> {t('privacy.purpose.communicationDesc')}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.cookieMgmt.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                {t('privacy.cookieMgmt.para1')}
              </p>
              <p className="mt-3">
                {t('privacy.cookieMgmt.para2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.security.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                {t('privacy.security.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.rights.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="mb-3">{t('privacy.rights.intro')}</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>{t('privacy.rights.access')}</strong> {t('privacy.rights.accessDesc')}
                </li>
                <li>
                  <strong>{t('privacy.rights.correction')}</strong> {t('privacy.rights.correctionDesc')}
                </li>
                <li>
                  <strong>{t('privacy.rights.deletion')}</strong> {t('privacy.rights.deletionDesc')}
                </li>
                <li>
                  <strong>{t('privacy.rights.consent')}</strong> {t('privacy.rights.consentDesc')}
                </li>
                <li>
                  <strong>{t('privacy.rights.portability')}</strong> {t('privacy.rights.portabilityDesc')}
                </li>
              </ul>
              <p className="mt-3">
                {t('privacy.rights.exercise')}{' '}
                <Link to="/contact" className="font-medium underline underline-offset-4 hover:text-primary">
                  {t('privacy.rights.contactPage')}
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.thirdParty.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                {t('privacy.thirdParty.content')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.updates.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                {t('privacy.updates.content')}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{t('privacy.updates.lastUpdated')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.contactUs.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                {t('privacy.contactUs.content')}{' '}
                <Link to="/contact" className="font-medium underline underline-offset-4 hover:text-primary">
                  {t('privacy.contactUs.contactPage')}
                </Link>
                {t('privacy.contactUs.response')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

