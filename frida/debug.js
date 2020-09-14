// frida -U --no-pause -l debug.js -f com.oceanwing.battery.cam

Java.perform(function () {
  console.log('');
  console.log('===');
  console.log('* Injecting hooks into common certificate pinning methods *');
  console.log('===');

  var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
  var SSLContext = Java.use('javax.net.ssl.SSLContext');

  // build fake trust manager
  var TrustManager = Java.registerClass({
    name: 'com.sensepost.test.TrustManager',
    implements: [X509TrustManager],
    methods: {
      checkClientTrusted: function (chain, authType) {},
      checkServerTrusted: function (chain, authType) {},
      getAcceptedIssuers: function () {
        return [];
      },
    },
  });

  // pass our own custom trust manager through when requested
  var TrustManagers = [TrustManager.$new()];
  var SSLContext_init = SSLContext.init.overload(
    '[Ljavax.net.ssl.KeyManager;',
    '[Ljavax.net.ssl.TrustManager;',
    'java.security.SecureRandom',
  );
  SSLContext_init.implementation = function (keyManager, trustManager, secureRandom) {
    // console.log('! Intercepted trustmanager request');
    SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
  };

  console.log('* Setup custom trust manager');

  // okhttp3
  try {
    var CertificatePinner = Java.use('okhttp3.CertificatePinner');
    CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function (str) {
      // console.log('! Intercepted okhttp3: ' + str);
      return;
    };

    console.log('* Setup okhttp3 pinning');
  } catch (err) {
    console.log('* Unable to hook into okhttp3 pinner');
  }

  // Obfuscated methods of okhttp3 (2.0.1-676(EU)) - Pinning
  try {
    var CertificatePinner = Java.use('okhttp3.g');
    CertificatePinner.a.overload('java.lang.String', 'java.util.List').implementation = function (str) {
      // console.log('! Intercepted okhttp3 CertificatePinner: ' + str);
      return;
    };
    console.log('* Setup okhttp3 pinning');
  } catch (err) {
    console.log('* Unable to hook into obfuscated okhttp3 pinner');
  }

  // Obfuscated methods of okhttp3 (2.0.1-676(EU)) - Logging
  try {
    var OkHttpClient = Java.use('okhttp3.x');
    OkHttpClient.a.overload('okhttp3.z').implementation = function (request) {
      var result = this.a(request);
      console.log('-----------REQUEST-----------');
      console.log(request.toString());
      console.log('-----------------------------');
      return result;
    };

    var RealCall = Java.use('okhttp3.y');
    RealCall.g.overload().implementation = function () {
      var response = this.g();
      console.log('-----------RESPONSE-----------');
      console.log(response.toString());
      console.log('-----------------------------');
      return response;
    };
  } catch (err) {
    console.log('* UNABLE to hook into okhttp3 request/response logging', err);
  }

  // TrustManagerImpl
  try {
    var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
    TrustManagerImpl.verifyChain.implementation = function (
      untrustedChain,
      trustAnchorChain,
      host,
      clientAuth,
      ocspData,
      tlsSctData,
    ) {
      // console.log('! Intercepted TrustManagerImp: ' + host);
      return untrustedChain;
    };

    console.log('* Setup TrustManagerImpl pinning');
  } catch (err) {
    console.log('* Unable to hook into TrustManagerImpl');
  }

  // ApiClient
  try {
    var array_list = Java.use('java.util.ArrayList');
    var ApiClient = Java.use('com.android.org.conscrypt.TrustManagerImpl');
    ApiClient.checkTrustedRecursive.implementation = function (a1, a2, a3, a4, a5, a6) {
      // console.log('Bypassing SSL Pinning');
      var k = array_list.$new();
      return k;
    };
  } catch (err) {
    console.log('* Unable to hook into conscrypt.TrustManagerImpl.checkTrustedRecursive');
  }

  // P2P Logging
  try {
    var P2PSender = Java.use('com.oceanwing.battery.cam.zmedia.P2PConnection.P2PSender');
    P2PSender.sendP2PRequest.implementation = function (zMediaCom) {
      var result = this.sendP2PRequest(zMediaCom);
      console.log('-----------P2P-----------');
      console.log('-> request', zMediaCom);
      console.log('<- response', result);
      console.log('-----------P2P-----------');
      return result;
    };

    var P2PReceiver = Java.use('com.oceanwing.battery.cam.zmedia.P2PConnection.P2PReceiver');
    P2PReceiver.NotifyCallback.implementation = function (r7, r8, r9, r10, r11, r12, r13) {
      var bufferR9 = Java.array('byte', r9);
      var resultR9 = '';
      for (var i = 0; i < bufferR9.length; ++i) {
        resultR9 += String.fromCharCode(bufferR9[i]);
      }
      var bufferR10 = Java.array('byte', r10);
      var resultR10 = '';
      for (var i = 0; i < bufferR10.length; ++i) {
        resultR10 += String.fromCharCode(bufferR10[i]);
      }
      console.log('P2P -> NotifyCallback', r7, r8, resultR9, resultR10, r11, r12, r13);
      return this.NotifyCallback(r7, r8, r9, r10, r11, r12, r13);
    };

    var ZFirebaseMessagingService = Java.use('com.oceanwing.battery.cam.base.push.service.ZFirebaseMessagingService');
    ZFirebaseMessagingService.onMessageReceived.implementation = function (a) {
      console.log('onMessageReceived', a);
      return this.onMessageReceived(a);
    };

    ZFirebaseMessagingService.a.overload('java.lang.String', 'java.lang.String').implementation = function (a, b) {
      console.log('onMessageReceived -> a', a, b);
      return this.a(a, b);
    };

    ZFirebaseMessagingService.b.implementation = function (a, b) {
      console.log('onMessageReceived -> b', a, b);
      return this.b(a, b);
    };

    ZFirebaseMessagingService.onNewToken.implementation = function (a) {
      console.log('onNewToken', a);
      return this.onNewToken(a);
    };

    var FirebaseInstanceId = Java.use('com.google.firebase.iid.FirebaseInstanceId');
    FirebaseInstanceId.getToken.overload().implementation = function () {
      var result = this.getToken();
      console.log('Firebase -> getToken() =>', result);
      return result;
    };
  } catch (err) {
    console.log('* Unable to hook into P2P', err);
  }
});
