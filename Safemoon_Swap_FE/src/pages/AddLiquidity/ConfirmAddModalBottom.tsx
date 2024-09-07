import { Currency, CurrencyAmount, Fraction, Percent } from '@safemoon/sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'
import {useActiveWeb3React} from "../../hooks";
import getTokenSymbol from "../../utils/getTokenSymbol";

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
    const { chainId } = useActiveWeb3React();
  return (
    <>
      <RowBetween>
        <TYPE.body>{getTokenSymbol(currencies[Field.CURRENCY_A], chainId)} Deposited</TYPE.body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <TYPE.body>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>{getTokenSymbol(currencies[Field.CURRENCY_B], chainId)} Deposited</TYPE.body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <TYPE.body>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>Rates</TYPE.body>
        <TYPE.body>
          {`1 ${getTokenSymbol(currencies[Field.CURRENCY_A], chainId)} = ${price?.toSignificant(4)} ${
              getTokenSymbol(currencies[Field.CURRENCY_B], chainId)
          }`}
        </TYPE.body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <TYPE.body>
          {`1 ${getTokenSymbol(currencies[Field.CURRENCY_B], chainId)} = ${price?.invert().toSignificant(4)} ${
              getTokenSymbol(currencies[Field.CURRENCY_A], chainId)
          }`}
        </TYPE.body>
      </RowBetween>
      <RowBetween>
        <TYPE.body>{t('shareOfPool') + ':'}</TYPE.body>
        <TYPE.body>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? t('createPoolAnd') : t('confirmSupply')}
        </Text>
      </ButtonPrimary>
    </>
  )
}
