## CA
Não Muda

## PRIVATE
openssl pkcs12 -in facta.pfx -out facta.pem -nodes
<bracinho>
openssl rsa -in facta.pem -out private.pem

## PUBLIC_ORIGINAL
openssl pkcs12 -in facta.pfx -out public_original.pem -nokeys
<bracinho>
openssl x509 -in public_original.pem -out public_original.pem

## PUBLIC
Edita o Public_Original e remove a linha de cabeçalho (-BEGIN CERTIFICATE-) e footer (-END CERTIFICATE-)

