<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div class="mx-auto mt-4" style="width: 700px">
    <h5 style="text-align: center">
      <img
        alt="Logo Ubhara"
        src="https://upload.wikimedia.org/wikipedia/id/b/b4/Logo_ubhara.png"
        style="float: left; height: 100px; width: 100px"
      /><strong
        >UNIVERSITAS BHAYANGKARA JAKARTA RAYA FAKULTAS ILMU KOMPUTER</strong
      >
    </h5>
    <h6 style="text-align: center">
      Kampus I: Jl. Harsono RM No. 67, Ragunan, Pasar Minggu, Jakarta Selatan
      12550
    </h6>
    <h6 style="text-align: center">
      Kampus II: Jl. Raya Perjuangan, Marga Mulya, Bekasi Utara, Jawa Barat
    </h6>
    <h6 style="margin-left: 80px; text-align: center">
      Telepon: (021) 27808121-27808882
    </h6>
    <p>&nbsp;</p>
    <h6 style="text-align: center">
      <strong><u>FORM PENGAJUAN KONSENTRASI</u></strong>
    </h6>
    <p style="text-align: justify">Saya yang bertanda tangan di bawah ini,</p>
    <p style="text-align: justify">
      Nama&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: {{ name }}
    </p>
    <p style="text-align: justify">
      Tempat / Tanggal lahir&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;:
    </p>
    <p style="text-align: justify">
      Nomor Pokok Mahasiswa&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : {{ student_id }}
    </p>
    <p style="text-align: justify">
      Nama Dosen Pemb. Akademik&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; :
    </p>
    <p style="text-align: justify">
      SKS yang telah ditempuh&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :
    </p>
    <p style="text-align: justify">
      Dalam hal ini Saya mengajukan peminatan mata kuliah yang sesuai dengan
      rekomendasi dari Sistem Pendukung Keputusan Pemilihan Peminatan tanpa ada
      unsur terpaksa, maka Saya mengajukan konsentrasi:
    </p>
    <ul>
      <li style="text-align: justify">{{ spec }}</li>
    </ul>
    <br />
    <p style="text-align: justify">
      Pada Tahun Akademik ....... / ....... semester ..... di Program Studi
      Informatika Fakultas Ilmu Komputer Universitas Bhayangkara Jakarta Raya.
      Peminatan ini meliputi:
    </p>
    <ol>
      <li style="text-align: justify">
        Mahasiswa wajib mengikuti mata kuliah konsentrasi yang dipilih.
      </li>
      <li style="text-align: justify">
        Pada saat mengambil mata kuliah skripsi Mahasiswa wajib membuat skripsi
        sesuai dengan konsentrasi yang dipilih.
      </li>
    </ol>
    <br />
    <table
      cellspacing="0"
      class="MsoTableGrid"
      style="border-collapse: collapse; border: none; margin-left: 39px"
    >
      <tbody>
        <tr>
          <td style="vertical-align: top; width: 327px">
            <p style="margin-right: 11px; text-align: center">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt">Menyetujui,</span></span
                ></span
              >
            </p>

            <p style="margin-right: 11px; text-align: center">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt"
                    >Dosen Pembimbing Akademik</span
                  ></span
                ></span
              >
            </p>
          </td>
          <td style="vertical-align: top; width: 327px">
            <p style="margin-right: 11px">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Bekasi, {{ date }}</span
                  ></span
                ></span
              >
            </p>

            <p style="margin-right: 11px; text-align: center">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt">Mahasiswa</span></span
                ></span
              >
            </p>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: top; width: 327px">
            <p style="margin-right: 11px">&nbsp;</p>
          </td>
          <td style="vertical-align: top; width: 327px">
            <p style="margin-right: 11px; text-align: center">&nbsp;</p>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: top; width: 327px">
            <p style="margin-right: 11px">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    (________________________)</span
                  ></span
                ></span
              >
            </p>

            <p style="margin-right: 11px">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt"
                    >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    NIDN:</span
                  ></span
                ></span
              >
            </p>
          </td>
          <td style="vertical-align: top; width: 327px">
            <p style="margin-right: 11px; text-align: center">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt"
                    >(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ name }}&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;)</span
                  ></span
                ></span
              >
            </p>

            <p style="margin-right: 11px">
              <span style="font-size: 10pt"
                ><span style="font-family: 'Times New Roman', serif"
                  ><span style="font-size: 12pt"
                    >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp;NPM: {{ student_id }}</span
                  ></span
                ></span
              >
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'NewForm',
  props: ['name', 'student_id', 'spec'],
  data() {
    return {
      date: new Date().toLocaleString('id-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }
  },
}
</script>
