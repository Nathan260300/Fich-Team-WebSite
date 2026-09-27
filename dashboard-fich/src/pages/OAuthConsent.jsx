import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const FICH_CLIENT_ID = 'TON_CLIENT_ID_FICH';

export default function OAuthConsent() {
  useEffect(() => {
    const authorize = async () => {
      const params = new URLSearchParams(window.location.search);
      const authorizationId = params.get('authorization_id');

      if (!authorizationId) {
        console.error('authorization_id manquant.');
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(sessionError);
        return;
      }

      if (!session) {
        console.error('Aucune session centrale.');
        return;
      }

      const {
        data: authorization,
        error: detailsError,
      } = await supabase.auth.oauth.getAuthorizationDetails(
        authorizationId
      );

      if (detailsError || !authorization) {
        console.error(
          detailsError?.message ?? 'Demande OAuth invalide.'
        );
        return;
      }

      if (!('authorization_id' in authorization)) {
        window.location.href = authorization.redirect_url;
        return;
      }

      if (authorization.client.id !== FICH_CLIENT_ID) {
        const { data, error } =
          await supabase.auth.oauth.denyAuthorization(
            authorizationId
          );

        if (error) {
          console.error(error);
          return;
        }

        if (data?.redirect_url) {
          window.location.href = data.redirect_url;
        }

        return;
      }

      const { data, error } =
        await supabase.auth.oauth.approveAuthorization(
          authorizationId
        );

      if (error) {
        console.error(error);
        return;
      }

      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      }
    };

    authorize();
  }, []);

  return null;
}